'use client';

import { motion } from 'framer-motion';

interface Token {
  symbol: string;
  transactions: number;
  volume: number;
}

interface Props {
  tokens: Token[];
}

export function TopTokenCard({ tokens }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          Your Top Tokens
        </h1>
        <p className="text-2xl text-white/70 text-center mb-12">
          Most traded assets of 2024
        </p>

        <div className="space-y-6">
          {tokens.slice(0, 5).map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{token.symbol}</h3>
                  <p className="text-white/70">{token.transactions} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  ${token.volume.toLocaleString()}
                </p>
                <p className="text-white/70 text-sm">Volume</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

