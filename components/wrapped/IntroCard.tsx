'use client';

import { motion } from 'framer-motion';

interface Props {
  year: number;
  username?: string;
}

export function IntroCard({ year, username }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-extrabold text-white mb-8"
        >
          Your {year}
        </motion.h1>
        <motion.p
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl text-white/90 mb-4"
        >
          {username ? `${username}'s` : 'Your'} Year On-Chain
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/70 text-xl"
        >
          Tap to continue →
        </motion.div>
      </motion.div>
    </div>
  );
}

