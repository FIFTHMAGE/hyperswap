'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface Swap {
  date: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

interface SwapActivityTimelineCardProps {
  swaps: Swap[];
  totalSwaps: number;
}

export function SwapActivityTimelineCard({ swaps, totalSwaps }: SwapActivityTimelineCardProps) {
  return (
    <StoryCard gradient="from-amber-900 to-orange-900">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-white text-center">
          Swap Activity
        </h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-extrabold text-amber-400">
            {totalSwaps}
          </div>
          <p className="text-xl text-white/80">swaps made</p>
        </motion.div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {swaps.slice(0, 5).map((swap, index) => (
            <motion.div
              key={index}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="bg-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-between text-white">
                <span className="font-medium">{swap.fromToken}</span>
                <span className="text-white/60">→</span>
                <span className="font-medium">{swap.toToken}</span>
              </div>
              <p className="text-sm text-white/60 mt-1">
                {new Date(swap.date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </StoryCard>
  );
}

