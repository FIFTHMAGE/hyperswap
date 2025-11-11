'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface MostActiveChainCardProps {
  chainName: string;
  transactionCount: number;
  totalTransactions: number;
}

export function MostActiveChainCard({ 
  chainName, 
  transactionCount, 
  totalTransactions 
}: MostActiveChainCardProps) {
  const percentage = Math.round((transactionCount / totalTransactions) * 100);
  
  return (
    <StoryCard gradient="from-emerald-900 to-teal-900">
      <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold text-white">
          Your favorite chain was
        </h2>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-7xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          {chainName}
        </motion.div>
        <div className="space-y-4">
          <p className="text-2xl text-white">
            {percentage}% of your transactions
          </p>
          <p className="text-xl text-white/70">
            {transactionCount.toLocaleString()} transactions
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

