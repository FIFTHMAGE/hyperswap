'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PoolAnalytics as PoolAnalyticsType } from '@/lib/types/liquidity';
import { liquidityService } from '@/lib/api/liquidity-service';

interface Props {
  poolAddress: string;
}

export function PoolAnalytics({ poolAddress }: Props) {
  const [analytics, setAnalytics] = useState<PoolAnalyticsType | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [poolAddress, timeframe]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await liquidityService.getPoolAnalytics(poolAddress, timeframe);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-12 text-gray-600 dark:text-gray-400">
        Analytics data not available
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {(['24h', '7d', '30d'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              timeframe === tf
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Volume History
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {analytics.volumeHistory.slice(0, 30).map((point, index) => {
              const maxVolume = Math.max(
                ...analytics.volumeHistory.map((p) => p.volume)
              );
              const height = (point.volume / maxVolume) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${height}%` }}
                  title={`${new Date(point.timestamp).toLocaleDateString()}: $${point.volume.toFixed(2)}`}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Liquidity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Liquidity History
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {analytics.liquidityHistory.slice(0, 30).map((point, index) => {
              const maxLiquidity = Math.max(
                ...analytics.liquidityHistory.map((p) => p.liquidity)
              );
              const height = (point.liquidity / maxLiquidity) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                  style={{ height: `${height}%` }}
                  title={`${new Date(point.timestamp).toLocaleDateString()}: $${point.liquidity.toFixed(2)}`}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-2">
          {analytics.transactions.slice(0, 10).map((tx, index) => (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    tx.type === 'swap'
                      ? 'bg-blue-100 text-blue-800'
                      : tx.type === 'mint'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tx.type.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${tx.amountUSD.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

