import { useState, useEffect } from 'react';
import { LimitOrder } from '@/lib/types/limit-order';

const ORDERS_KEY = 'hyperswap_limit_orders';

export function useLimitOrders(userAddress?: string) {
  const [orders, setOrders] = useState<LimitOrder[]>([]);

  useEffect(() => {
    loadOrders();
  }, [userAddress]);

  const loadOrders = () => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) {
        const allOrders = JSON.parse(stored);
        setOrders(
          userAddress
            ? allOrders.filter((o: LimitOrder) => o.userAddress === userAddress)
            : allOrders
        );
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveOrders = (newOrders: LimitOrder[]) => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
      loadOrders();
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const createOrder = (order: Omit<LimitOrder, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: LimitOrder = {
      ...order,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'active',
    };
    saveOrders([...orders, newOrder]);
  };

  const cancelOrder = (orderId: string) => {
    const allOrders: LimitOrder[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    saveOrders(
      allOrders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const } : o))
    );
  };

  const activeOrders = orders.filter((o) => o.status === 'active');

  return { orders, activeOrders, createOrder, cancelOrder };
}

