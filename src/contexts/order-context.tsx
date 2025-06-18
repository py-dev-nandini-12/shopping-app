'use client'

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/auth-context';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number; // Price at time of purchase
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: {
    type: 'credit' | 'debit';
    last4: string;
  };
}

interface OrderState {
  orders: Order[];
}

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'LOAD_ORDERS'; payload: Order[] };

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  addOrder: (orderData: Omit<Order, 'id' | 'orderDate'>) => string;
} | null>(null);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders].sort((a, b) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.orderId 
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    
    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload.sort((a, b) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
      };
    
    default:
      return state;
  }
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(orderReducer, { orders: [] });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load orders from localStorage when user changes
  useEffect(() => {
    const loadOrders = () => {
      try {
        if (typeof window !== 'undefined' && user) {
          const storageKey = `orders_${user.id}`;
          const savedOrders = localStorage.getItem(storageKey);
          if (savedOrders) {
            const ordersData = JSON.parse(savedOrders);
            dispatch({ type: 'LOAD_ORDERS', payload: ordersData });
          }
          setIsInitialized(true);
        } else if (!user) {
          // Clear orders if no user
          dispatch({ type: 'LOAD_ORDERS', payload: [] });
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setIsInitialized(true);
      }
    };

    loadOrders();
  }, [user]);

  // Save orders to localStorage whenever orders change (after initialization)
  useEffect(() => {
    if (!isInitialized || !user) return;

    const saveOrders = () => {
      try {
        if (typeof window !== 'undefined') {
          const storageKey = `orders_${user.id}`;
          localStorage.setItem(storageKey, JSON.stringify(state.orders));
        }
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    };

    saveOrders();
  }, [state.orders, user, isInitialized]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate'>): string => {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order: Order = {
      ...orderData,
      id: orderId,
      orderDate: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_ORDER', payload: order });
    return orderId;
  };

  return (
    <OrderContext.Provider value={{ state, dispatch, addOrder }}>
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
