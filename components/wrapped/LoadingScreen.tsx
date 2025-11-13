'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-8xl mb-8"
        >
          🎁
        </motion.div>
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Unwrapping your year...
        </h2>
        <p className="text-xl text-white/70">
          Analyzing your on-chain activity
        </p>
      </motion.div>
    </div>
  );
}

