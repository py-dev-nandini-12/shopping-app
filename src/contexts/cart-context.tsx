'use client'

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useOptimistic, startTransition, useCallback } from 'react';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/auth-context';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number; size?: string; color?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  optimisticState: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCartOptimistic: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCartOptimistic: (id: string) => void;
  updateQuantityOptimistic: (id: string, quantity: number) => void;
  clearCartOptimistic: () => void;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1, size, color } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size || 'default'}-${color || 'default'}`,
          product,
          quantity,
          size,
          color
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { id } });
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // React 19 useOptimistic for immediate UI feedback
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState: CartState, action: CartAction) => cartReducer(currentState, action)
  );

  // Optimistic action helpers using startTransition
  const addToCartOptimistic = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    startTransition(() => {
      setOptimisticState({ type: 'ADD_TO_CART', payload: { product, quantity, size, color } });
    });
    // Also dispatch the real action
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, size, color } });
  }, [setOptimisticState]);

  const removeFromCartOptimistic = useCallback((id: string) => {
    startTransition(() => {
      setOptimisticState({ type: 'REMOVE_FROM_CART', payload: { id } });
    });
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  }, [setOptimisticState]);

  const updateQuantityOptimistic = useCallback((id: string, quantity: number) => {
    startTransition(() => {
      setOptimisticState({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    });
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, [setOptimisticState]);

  const clearCartOptimistic = useCallback(() => {
    startTransition(() => {
      setOptimisticState({ type: 'CLEAR_CART' });
    });
    dispatch({ type: 'CLEAR_CART' });
  }, [setOptimisticState]);

  // Listen for logout events to immediately clear cart
  useEffect(() => {
    const handleLogout = () => {
      clearCartOptimistic();
    };

    window.addEventListener('userLogout', handleLogout);
    return () => window.removeEventListener('userLogout', handleLogout);
  }, [clearCartOptimistic]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    const loadCart = () => {
      try {
        if (typeof window !== 'undefined') {
          const storageKey = user ? `cart_${user.id}` : 'cart_guest';
          const savedCart = localStorage.getItem(storageKey);
          if (savedCart) {
            const cartData = JSON.parse(savedCart);
            dispatch({ type: 'LOAD_CART', payload: cartData });
          } else {
            // Clear cart if no data for this user
            dispatch({ type: 'CLEAR_CART' });
          }
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setIsInitialized(true);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever state changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const saveCart = () => {
      try {
        if (typeof window !== 'undefined') {
          const storageKey = user ? `cart_${user.id}` : 'cart_guest';
          localStorage.setItem(storageKey, JSON.stringify(state));
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    // Save cart state including when it's empty (after clearing)
    saveCart();
  }, [state, user, isInitialized]);

  return (
    <CartContext.Provider value={{ 
      state, 
      optimisticState,
      dispatch,
      addToCartOptimistic,
      removeFromCartOptimistic,
      updateQuantityOptimistic,
      clearCartOptimistic
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
