'use client';

import { motion } from 'framer-motion';

interface Props {
  totalTx: number;
  totalVolume: number;
  chainsUsed: number;
  totalGas: number;
}

export function SummaryCard({ totalTx, totalVolume, chainsUsed, totalGas }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full space-y-12">
        <h1 className="text-6xl font-extrabold text-white text-center">
          Your Year in Numbers
        </h1>

        <div className="grid grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center"
          >
            <p className="text-7xl font-extrabold text-white mb-4">{totalTx}</p>
            <p className="text-2xl text-white/80">Transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center"
          >
            <p className="text-7xl font-extrabold text-white mb-4">
              ${(totalVolume / 1000).toFixed(0)}K
            </p>
            <p className="text-2xl text-white/80">Volume</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center"
          >
            <p className="text-7xl font-extrabold text-white mb-4">{chainsUsed}</p>
            <p className="text-2xl text-white/80">Chains</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center"
          >
            <p className="text-7xl font-extrabold text-white mb-4">
              ${totalGas.toFixed(0)}
            </p>
            <p className="text-2xl text-white/80">Gas Fees</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

