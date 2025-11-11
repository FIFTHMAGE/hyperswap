'use client';

import { StoryCard } from '../StoryCard';
import { WalletWrappedStats } from '@/lib/types/wrapped';

interface SummaryCardProps {
  stats: WalletWrappedStats;
}

export function SummaryCard({ stats }: SummaryCardProps) {
  return (
    <StoryCard gradient="from-violet-900 to-purple-900">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Your {stats.year} in Numbers
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">
              {stats.totalTransactions}
            </p>
            <p className="text-sm text-white/70">Transactions</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">
              {stats.activeDays}
            </p>
            <p className="text-sm text-white/70">Active Days</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">
              {stats.uniqueTokensHeld}
            </p>
            <p className="text-sm text-white/70">Unique Tokens</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">
              {stats.totalNFTsHeld}
            </p>
            <p className="text-sm text-white/70">NFTs</p>
          </div>
        </div>
        {stats.rank && (
          <div className="mt-8 text-center">
            <p className="text-lg text-white/70 mb-2">You&apos;re a</p>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              {stats.rank}
            </p>
          </div>
        )}
      </div>
    </StoryCard>
  );
}

