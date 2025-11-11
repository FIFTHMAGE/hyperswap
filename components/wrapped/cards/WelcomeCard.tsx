'use client';

import { StoryCard } from '../StoryCard';
import { formatAddress } from '@/lib/utils/format';

interface WelcomeCardProps {
  address: string;
  year: number;
}

export function WelcomeCard({ address, year }: WelcomeCardProps) {
  return (
    <StoryCard gradient="from-indigo-900 via-purple-900 to-pink-900">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">
          Your {year} <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Wallet Wrapped
          </span>
        </h1>
        <p className="text-2xl text-white/80">
          {formatAddress(address)}
        </p>
        <p className="text-lg text-white/60">
          Let&apos;s dive into your year on-chain
        </p>
      </div>
    </StoryCard>
  );
}

