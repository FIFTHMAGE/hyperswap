'use client';

import { motion } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';

export function ConnectionStatus() {
  const { connected, error } = useWebSocket();

  if (connected && !error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className={`px-6 py-3 rounded-full shadow-lg ${
        error
          ? 'bg-red-500'
          : 'bg-yellow-500'
      } text-white font-semibold flex items-center gap-3`}>
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        {error ? 'Connection Error' : 'Reconnecting...'}
      </div>
    </motion.div>
  );
}

