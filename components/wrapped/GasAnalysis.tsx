'use client';

import { motion } from 'framer-motion';

interface Props {
  totalGas: number;
  avgGasPrice: number;
  savedByOptimization: number;
  mostExpensiveTx: {
    hash: string;
    gasPaid: number;
    date: string;
  };
}

export function GasAnalysis({
  totalGas,
  avgGasPrice,
  savedByOptimization,
  mostExpensiveTx,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          ⛽ Gas Report
        </h1>
        <p className="text-2xl text-white/70 text-center mb-12">
          Your year in gas fees
        </p>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <p className="text-white/70 mb-2">Total Gas Spent</p>
            <p className="text-7xl font-extrabold text-white">${totalGas.toFixed(2)}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
            >
              <p className="text-white/70 mb-2">Average Gas Price</p>
              <p className="text-4xl font-bold text-white">{avgGasPrice} Gwei</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
            >
              <p className="text-white/70 mb-2">Saved by Optimization</p>
              <p className="text-4xl font-bold text-green-400">
                ${savedByOptimization.toFixed(2)}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <p className="text-white/70 mb-4 text-center">Most Expensive Transaction</p>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">
                ${mostExpensiveTx.gasPaid.toFixed(2)}
              </p>
              <p className="text-sm text-white/60">{mostExpensiveTx.date}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

