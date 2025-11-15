'use client';

import { motion } from 'framer-motion';

interface Props {
  firstTx: {
    date: string;
    token: string;
    amount: number;
  };
  lastTx: {
    date: string;
    token: string;
    amount: number;
  };
}

export function FirstLastTransactionCard({ firstTx, lastTx }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-16">
          Your Journey
        </h1>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12"
          >
            <p className="text-3xl font-bold text-white/70 mb-6">First Transaction</p>
            <p className="text-5xl font-extrabold text-white mb-4">{firstTx.date}</p>
            <p className="text-2xl text-white/90">
              {firstTx.amount} {firstTx.token}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12"
          >
            <p className="text-3xl font-bold text-white/70 mb-6">Latest Transaction</p>
            <p className="text-5xl font-extrabold text-white mb-4">{lastTx.date}</p>
            <p className="text-2xl text-white/90">
              {lastTx.amount} {lastTx.token}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

