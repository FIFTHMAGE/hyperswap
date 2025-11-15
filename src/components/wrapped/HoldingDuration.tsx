'use client';

import { motion } from 'framer-motion';
import { TokenHolding } from '@/lib/types/wrapped';

interface Props {
  holdings: TokenHolding[];
}

export function HoldingDuration({ holdings }: Props) {
  const formatDuration = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${(days / 365).toFixed(1)} years`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Diamond Hands 💎
        </h1>

        <div className="space-y-4">
          {holdings.map((holding, index) => (
            <motion.div
              key={holding.symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-white">{holding.symbol}</h3>
                  <p className="text-white/70">
                    Held for {formatDuration(holding.holdDuration)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {holding.profitLoss >= 0 ? '+' : ''}
                    {holding.profitLoss.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-white/60 text-sm">
                <span>Avg Buy: ${holding.avgBuyPrice.toFixed(2)}</span>
                <span>Current: ${holding.currentPrice.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

