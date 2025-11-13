'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';

interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
}

export function LivePriceFeed() {
  const [prices, setPrices] = useState<Map<string, PriceUpdate>>(new Map());
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe('price_update', (data: PriceUpdate) => {
        setPrices((prev) => new Map(prev).set(data.symbol, data));
      });

      return unsubscribe;
    }
  }, [connected, subscribe]);

  const priceArray = Array.from(prices.values());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Live Prices
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {priceArray.map((item) => (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.symbol}
                </p>
                <p
                  className={`text-sm ${
                    item.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.change24h >= 0 ? '+' : ''}
                  {item.change24h.toFixed(2)}%
                </p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${item.price.toFixed(2)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

