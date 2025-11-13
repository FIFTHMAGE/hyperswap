'use client';

import { motion } from 'framer-motion';
import { WhaleTransaction } from '@/lib/types/wrapped';

interface Props {
  transactions: WhaleTransaction[];
}

export function WhaleWatching({ transactions }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-7xl font-extrabold text-white text-center mb-4"
        >
          🐋 Whale Alert!
        </motion.h1>
        <p className="text-2xl text-white/80 text-center mb-12">
          Your largest transactions
        </p>

        <div className="space-y-4">
          {transactions.slice(0, 5).map((tx, index) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-white mb-2">
                    ${tx.value.toLocaleString()}
                  </p>
                  <p className="text-white/70 text-sm">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-4xl ${
                    tx.type === 'received' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {tx.type === 'received' ? '↓' : '↑'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

