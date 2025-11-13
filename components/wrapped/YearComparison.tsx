'use client';

import { motion } from 'framer-motion';

interface YearStats {
  year: number;
  transactions: number;
  volume: number;
  gasSpent: number;
}

interface Props {
  currentYear: YearStats;
  previousYear: YearStats;
}

export function YearComparison({ currentYear, previousYear }: Props) {
  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      label: 'Transactions',
      current: currentYear.transactions,
      previous: previousYear.transactions,
      change: calculateChange(currentYear.transactions, previousYear.transactions),
    },
    {
      label: 'Volume',
      current: `$${currentYear.volume.toLocaleString()}`,
      previous: `$${previousYear.volume.toLocaleString()}`,
      change: calculateChange(currentYear.volume, previousYear.volume),
    },
    {
      label: 'Gas Spent',
      current: `$${currentYear.gasSpent.toLocaleString()}`,
      previous: `$${previousYear.gasSpent.toLocaleString()}`,
      change: calculateChange(currentYear.gasSpent, previousYear.gasSpent),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          {currentYear.year} vs {previousYear.year}
        </h1>

        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{metric.label}</h3>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-1">{previousYear.year}</p>
                  <p className="text-3xl font-bold text-white">{metric.previous}</p>
                </div>

                <div className="flex-1 mx-8">
                  <div
                    className={`text-center text-2xl font-bold ${
                      metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {metric.change >= 0 ? '↗' : '↘'} {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-white/60 mb-1">{currentYear.year}</p>
                  <p className="text-3xl font-bold text-white">{metric.current}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

