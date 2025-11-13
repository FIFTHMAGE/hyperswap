'use client';

import { motion } from 'framer-motion';

interface Props {
  totalGain: number;
  totalLoss: number;
  winRate: number;
}

export function GainLossCalculator({ totalGain, totalLoss, winRate }: Props) {
  const netProfit = totalGain - totalLoss;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-extrabold text-white mb-12">
          Your Trading Performance
        </h1>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-8xl font-extrabold text-white mb-4">
            {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}
          </p>
          <p className="text-3xl text-white/80">Net P&L</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <p className="text-4xl font-bold text-green-400 mb-2">
              +${totalGain.toLocaleString()}
            </p>
            <p className="text-white/70">Total Gains</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <p className="text-4xl font-bold text-red-400 mb-2">
              -${totalLoss.toLocaleString()}
            </p>
            <p className="text-white/70">Total Losses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <p className="text-4xl font-bold text-blue-400 mb-2">{winRate.toFixed(1)}%</p>
            <p className="text-white/70">Win Rate</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

