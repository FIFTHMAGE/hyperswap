'use client';

import { StoryCard } from '../StoryCard';
import { TokenBalance } from '@/lib/types/token';
import { formatCurrency } from '@/lib/utils/format';

interface TopTokensCardProps {
  tokens: TokenBalance[];
}

export function TopTokensCard({ tokens }: TopTokensCardProps) {
  const topFive = tokens.slice(0, 5);
  
  return (
    <StoryCard gradient="from-yellow-900 to-orange-900">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-white text-center">
          Your Top Tokens
        </h2>
        <div className="space-y-4">
          {topFive.map((token, index) => (
            <div
              key={token.contractAddress}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-white/50">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-xl font-semibold text-white">
                    {token.contractSymbol}
                  </p>
                  <p className="text-sm text-white/60">
                    {token.contractName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  {formatCurrency(token.quote)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StoryCard>
  );
}

