'use client'

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/auth-context';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: { id: string } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistState };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  isInWishlist: (id: string) => boolean;
} | null>(null);

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) return state;
      return { items: [...state.items, action.payload] };
    }

    case 'REMOVE_FROM_WISHLIST': {
      return {
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    }

    case 'CLEAR_WISHLIST':
      return { items: [] };

    case 'LOAD_WISHLIST':
      return action.payload;

    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: []
  });

  // Listen for logout events to immediately clear wishlist
  useEffect(() => {
    const handleLogout = () => {
      console.log('Logout event received in wishlist context, clearing wishlist');
      dispatch({ type: 'CLEAR_WISHLIST' });
    };

    window.addEventListener('userLogout', handleLogout);
    return () => window.removeEventListener('userLogout', handleLogout);
  }, []);

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    const loadWishlist = () => {
      try {
        if (typeof window !== 'undefined') {
          const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
          console.log('Loading wishlist with key:', storageKey, 'User:', user);
          const savedWishlist = localStorage.getItem(storageKey);
          console.log('Saved wishlist data:', savedWishlist);
          if (savedWishlist) {
            const wishlistData = JSON.parse(savedWishlist);
            console.log('Parsed wishlist data:', wishlistData);
            dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData });
          } else {
            // Clear wishlist if no data for this user
            console.log('No wishlist data found, clearing wishlist');
            dispatch({ type: 'CLEAR_WISHLIST' });
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        // Clear wishlist on error
        dispatch({ type: 'CLEAR_WISHLIST' });
      }
    };

    // Always load wishlist when user changes (including when user becomes null)
    loadWishlist();
  }, [user]); // This will trigger when user logs out (user becomes null)

  // Save wishlist to localStorage whenever state changes
  useEffect(() => {
    const saveWishlist = () => {
      try {
        if (typeof window !== 'undefined') {
          const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
          console.log('Saving wishlist with key:', storageKey, 'State:', state);
          localStorage.setItem(storageKey, JSON.stringify(state));
        }
      } catch (error) {
        console.error('Error saving wishlist:', error);
      }
    };

    // Always save the state (including empty wishlist)
    saveWishlist();
  }, [state, user]);

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ state, dispatch, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
