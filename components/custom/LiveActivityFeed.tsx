'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Activity {
  id: string;
  type: 'swap' | 'transfer' | 'approval';
  from: string;
  to: string;
  token: string;
  amount: string;
  timestamp: number;
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe('activity', (data: Activity) => {
        setActivities((prev) => [data, ...prev].slice(0, 10));
      });
      return unsubscribe;
    }
  }, [connected, subscribe]);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Live Activity Feed
      </h2>

      <div className="space-y-3">
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {activity.type === 'swap' && '🔄'}
                  {activity.type === 'transfer' && '📤'}
                  {activity.type === 'approval' && '✅'}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {activity.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatAddress(activity.from)} → {formatAddress(activity.to)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-gray-900 dark:text-white">
                  {activity.amount} {activity.token}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

