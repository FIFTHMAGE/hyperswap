'use client';

import { motion } from 'framer-motion';
import { useSwapHistory } from '@/hooks/useSwapHistory';
import { FormatUtils } from '@/lib/utils/format';

export function SwapAnalyticsDashboard() {
  const { getAnalytics } = useSwapHistory();
  const analytics = getAnalytics();

  const stats = [
    {
      label: 'Total Volume',
      value: FormatUtils.formatCurrency(analytics.totalVolumeUSD),
      icon: '💰',
      color: 'blue',
    },
    {
      label: 'Total Swaps',
      value: analytics.totalSwaps.toString(),
      icon: '🔄',
      color: 'green',
    },
    {
      label: 'Success Rate',
      value: `${analytics.successRate.toFixed(1)}%`,
      icon: '✅',
      color: 'purple',
    },
    {
      label: 'Gas Spent',
      value: FormatUtils.formatCurrency(analytics.totalGasCostUSD),
      icon: '⛽',
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-2 h-2 rounded-full bg-${stat.color}-500`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trading Activity */}
      {analytics.tradingActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4">Trading Activity</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.tradingActivity.slice(-30).map((day, index) => {
              const maxVolume = Math.max(
                ...analytics.tradingActivity.map((d) => d.volume)
              );
              const height = (day.volume / maxVolume) * 100;
              return (
                <div
                  key={day.date}
                  className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${FormatUtils.formatCurrency(day.volume)}`}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Top Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4">Most Traded</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="font-semibold">{analytics.mostTradedToken.symbol}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {analytics.mostTradedToken.count} trades
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

