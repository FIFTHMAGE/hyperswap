'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface TransactionsCardProps {
  totalTransactions: number;
}

export function TransactionsCard({ totalTransactions }: TransactionsCardProps) {
  return (
    <StoryCard gradient="from-blue-900 to-purple-900">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">
          You made
        </h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-8xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          {totalTransactions.toLocaleString()}
        </motion.div>
        <h3 className="text-4xl font-bold text-white">
          transactions
        </h3>
        <p className="text-xl text-white/70">
          That&apos;s {Math.round(totalTransactions / 12)} per month!
        </p>
      </div>
    </StoryCard>
  );
}

