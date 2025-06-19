'use client'

import React, { createContext, useContext, useReducer, useCallback, useOptimistic, startTransition, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { CartItem } from '@/contexts/cart-context';

export interface Order {
  id: string;
  userId: string | null;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  orderDate: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: {
    cardNumber: string;
    expiryDate: string;
    nameOnCard: string;
  };
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
}

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'LOAD_ORDERS'; payload: Order[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ORDERS' };

const OrderContext = createContext<{
  state: OrderState;
  optimisticState: OrderState;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'orderDate'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
} | null>(null);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    
    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload,
        isLoading: false,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'CLEAR_ORDERS':
      return {
        orders: [],
        isLoading: false,
      };
    
    default:
      return state;
  }
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
    isLoading: false,
  });

  // React 19 useOptimistic for immediate UI feedback
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState: OrderState, action: OrderAction) => orderReducer(currentState, action)
  );

  // Load orders from localStorage when user changes
  useEffect(() => {
    const loadOrders = () => {
      try {
        if (typeof window !== 'undefined' && user) {
          dispatch({ type: 'SET_LOADING', payload: true });
          const storageKey = `orders_${user.id}`;
          const savedOrders = localStorage.getItem(storageKey);
          if (savedOrders) {
            const orders = JSON.parse(savedOrders).map((order: Omit<Order, 'createdAt'> & { createdAt: string }) => ({
              ...order,
              createdAt: new Date(order.createdAt),
            }));
            dispatch({ type: 'LOAD_ORDERS', payload: orders });
          } else {
            dispatch({ type: 'LOAD_ORDERS', payload: [] });
          }
        } else {
          dispatch({ type: 'CLEAR_ORDERS' });
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadOrders();
  }, [user]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (user && state.orders.length >= 0) {
      try {
        const storageKey = `orders_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(state.orders));
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    }
  }, [state.orders, user]);

  // Clear orders on logout
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: 'CLEAR_ORDERS' });
    };

    window.addEventListener('userLogout', handleLogout);
    return () => window.removeEventListener('userLogout', handleLogout);
  }, []);

  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'orderDate'>): Promise<string> => {
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const currentDate = new Date();
    const order: Order = {
      ...orderData,
      id: orderId,
      createdAt: currentDate,
      orderDate: currentDate.toISOString(),
    };

    // Optimistic update
    startTransition(() => {
      setOptimisticState({ type: 'ADD_ORDER', payload: order });
    });

    // Real update
    dispatch({ type: 'ADD_ORDER', payload: order });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return orderId;
  }, [setOptimisticState]);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    // Optimistic update
    startTransition(() => {
      setOptimisticState({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
    });

    // Real update
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
  }, [setOptimisticState]);

  const cancelOrder = useCallback((id: string) => {
    updateOrderStatus(id, 'cancelled');
  }, [updateOrderStatus]);

  const getOrderById = useCallback((id: string): Order | undefined => {
    return optimisticState.orders.find(order => order.id === id);
  }, [optimisticState.orders]);

  return (
    <OrderContext.Provider
      value={{
        state,
        optimisticState,
        addOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
