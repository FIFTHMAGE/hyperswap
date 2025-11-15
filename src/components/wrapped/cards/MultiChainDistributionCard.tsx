'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface ChainData {
  chainId: number;
  chainName: string;
  percentage: number;
  txCount: number;
}

interface MultiChainDistributionCardProps {
  chains: ChainData[];
}

export function MultiChainDistributionCard({ chains }: MultiChainDistributionCardProps) {
  const colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
  
  return (
    <StoryCard gradient="from-violet-900 to-fuchsia-900">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-white text-center">
          Multi-Chain Activity
        </h2>
        
        <div className="space-y-4">
          {chains.slice(0, 5).map((chain, index) => (
            <motion.div
              key={chain.chainId}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="space-y-2"
            >
              <div className="flex justify-between text-white">
                <span className="font-semibold">{chain.chainName}</span>
                <span>{chain.percentage.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${chain.percentage}%` }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
              </div>
              <p className="text-sm text-white/60">{chain.txCount} transactions</p>
            </motion.div>
          ))}
        </div>
      </div>
    </StoryCard>
  );
}

