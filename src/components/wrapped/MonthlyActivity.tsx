'use client';

import { motion } from 'framer-motion';

interface Props {
  monthlyData: { month: string; transactions: number }[];
}

export function MonthlyActivity({ monthlyData }: Props) {
  const maxTx = Math.max(...monthlyData.map((m) => m.transactions));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Your Activity Timeline
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
          <div className="flex items-end justify-between h-64 gap-2">
            {monthlyData.map((month, index) => {
              const height = (month.transactions / maxTx) * 100;
              return (
                <motion.div
                  key={month.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t-lg relative group"
                  title={`${month.month}: ${month.transactions} transactions`}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-white text-xs whitespace-nowrap">
                    {month.transactions} txs
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-white/70 text-sm">
            {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

