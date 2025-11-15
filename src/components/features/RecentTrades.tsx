'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Trade {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export function RecentTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe('trade', (data: Trade) => {
        setTrades((prev) => [data, ...prev].slice(0, 20));
      });
      return unsubscribe;
    }
  }, [connected, subscribe]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Recent Trades
      </h2>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-3 mb-2">
          <span>Price</span>
          <span>Amount</span>
          <span>Time</span>
        </div>

        <AnimatePresence>
          {trades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex justify-between px-3 py-2 rounded ${
                trade.side === 'buy'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              <span className="font-mono">{trade.price.toFixed(2)}</span>
              <span className="font-mono">{trade.amount.toFixed(4)}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

