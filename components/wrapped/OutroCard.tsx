'use client';

import { motion } from 'framer-motion';

interface Props {
  year: number;
}

export function OutroCard({ year }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-7xl font-extrabold text-white mb-8"
        >
          That was your {year}
        </motion.h1>
        
        <motion.p
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl text-white/90 mb-12"
        >
          Thanks for being part of the on-chain revolution
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <p className="text-2xl text-white/70">Here's to an even bigger {year + 1}!</p>
          <p className="text-6xl">🚀</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

