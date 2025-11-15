'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/format';

interface PortfolioValueCardProps {
  currentValue: number;
  changePercent: number;
}

export function PortfolioValueCard({ currentValue, changePercent }: PortfolioValueCardProps) {
  const isPositive = changePercent >= 0;
  
  return (
    <StoryCard gradient="from-green-900 to-emerald-900">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">
          Your Portfolio
        </h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="space-y-4"
        >
          <div className="text-7xl font-extrabold text-white">
            {formatCurrency(currentValue)}
          </div>
          <div className={`text-2xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(2)}%
          </div>
        </motion.div>
        <p className="text-xl text-white/70">
          {isPositive ? 'Great job growing your portfolio!' : 'Stay strong, markets fluctuate!'}
        </p>
      </div>
    </StoryCard>
  );
}

