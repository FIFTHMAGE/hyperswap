'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

export function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe('notification', (data: Notification) => {
        setNotifications((prev) => [data, ...prev].slice(0, 5));
        
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== data.id));
        }, 5000);
      });
      return unsubscribe;
    }
  }, [connected, subscribe]);

  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`${colors[notif.type]} text-white rounded-xl p-4 shadow-lg max-w-sm`}
          >
            <h4 className="font-bold mb-1">{notif.title}</h4>
            <p className="text-sm opacity-90">{notif.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

