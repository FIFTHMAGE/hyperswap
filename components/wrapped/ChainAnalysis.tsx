'use client';

import { motion } from 'framer-motion';

interface Chain {
  name: string;
  logo: string;
  transactions: number;
  volume: number;
}

interface Props {
  chains: Chain[];
}

export function ChainAnalysis({ chains }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Multi-Chain Master
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {chains.map((chain, index) => (
            <motion.div
              key={chain.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
            >
              <div className="text-5xl mb-4 text-center">{chain.logo}</div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">
                {chain.name}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Transactions:</span>
                  <span className="font-bold">{chain.transactions}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Volume:</span>
                  <span className="font-bold">${chain.volume.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

