'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';

interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export function LiveOrderBook() {
  const [bids, setBids] = useState<OrderBookLevel[]>([]);
  const [asks, setAsks] = useState<OrderBookLevel[]>([]);
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe('order_book', (data) => {
        setBids(data.bids.slice(0, 10));
        setAsks(data.asks.slice(0, 10));
      });
      return unsubscribe;
    }
  }, [connected, subscribe]);

  const renderLevel = (level: OrderBookLevel, isBid: boolean) => {
    const maxTotal = Math.max(
      ...bids.map((b) => b.total),
      ...asks.map((a) => a.total)
    );
    const width = (level.total / maxTotal) * 100;

    return (
      <div className="relative px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <div
          className={`absolute inset-0 ${
            isBid ? 'bg-green-500/10' : 'bg-red-500/10'
          }`}
          style={{ width: `${width}%` }}
        />
        <div className="relative flex justify-between text-sm font-mono">
          <span className={isBid ? 'text-green-600' : 'text-red-600'}>
            {level.price.toFixed(2)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {level.amount.toFixed(4)}
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {level.total.toFixed(4)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Order Book
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 px-3">
            <span>Price (USD)</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          
          <div className="space-y-px">
            {asks.reverse().map((ask, i) => (
              <div key={`ask-${i}`}>{renderLevel(ask, false)}</div>
            ))}
          </div>
        </div>

        <div className="text-center py-2 text-2xl font-bold text-gray-900 dark:text-white">
          {asks[0]?.price.toFixed(2)}
        </div>

        <div className="space-y-px">
          {bids.map((bid, i) => (
            <div key={`bid-${i}`}>{renderLevel(bid, true)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

