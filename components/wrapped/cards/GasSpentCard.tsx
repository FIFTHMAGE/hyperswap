'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/format';

interface GasSpentCardProps {
  gasSpent: {
    eth: string;
    usd: number;
  };
}

export function GasSpentCard({ gasSpent }: GasSpentCardProps) {
  const coffees = Math.round(gasSpent.usd / 5);
  
  return (
    <StoryCard gradient="from-orange-900 to-red-900">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">
          You spent
        </h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="space-y-2"
        >
          <div className="text-6xl font-extrabold text-white">
            {gasSpent.eth} ETH
          </div>
          <div className="text-3xl text-white/80">
            {formatCurrency(gasSpent.usd)}
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-white">
          on gas fees
        </h3>
        <p className="text-xl text-white/70">
          That&apos;s enough to buy {coffees.toLocaleString()} ☕ coffees!
        </p>
      </div>
    </StoryCard>
  );
}

