'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSwapHistory } from '@/hooks/useSwapHistory';
import { PortfolioPosition, PortfolioStats, AssetAllocation } from '@/lib/types/portfolio';
import { PortfolioCalculator } from '@/lib/utils/portfolio-calculator';

export function PortfolioTracker() {
  const { history } = useSwapHistory();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [allocation, setAllocation] = useState<AssetAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculatePortfolio();
  }, [history]);

  const calculatePortfolio = async () => {
    setLoading(true);
    try {
      // Mock current prices - in production, fetch from API
      const currentPrices = new Map<string, number>();
      history.forEach((tx) => {
        if (tx.outputToken?.price) {
          currentPrices.set(tx.outputToken.address, tx.outputToken.price || 100);
        }
        if (tx.inputToken?.price) {
          currentPrices.set(tx.inputToken.address, tx.inputToken.price || 100);
        }
      });

      const calculatedPositions = PortfolioCalculator.calculatePositions(
        history,
        currentPrices
      );
      const calculatedStats = PortfolioCalculator.calculateStats(calculatedPositions);
      const calculatedAllocation = PortfolioCalculator.calculateAllocation(calculatedPositions);

      setPositions(calculatedPositions);
      setStats(calculatedStats);
      setAllocation(calculatedAllocation);
    } catch (error) {
      console.error('Error calculating portfolio:', error);
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Portfolio Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Value
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.totalValueUSD.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Invested: ${stats.totalInvested.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total P&L
            </p>
            <p
              className={`text-3xl font-bold ${
                stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.totalProfitLoss >= 0 ? '+' : ''}$
              {stats.totalProfitLoss.toFixed(2)}
            </p>
            <p
              className={`text-sm mt-2 ${
                stats.totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.totalProfitLossPercent >= 0 ? '+' : ''}
              {stats.totalProfitLossPercent.toFixed(2)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Best Performer
            </p>
            {stats.bestPerformer ? (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.bestPerformer.symbol}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  +{stats.bestPerformer.profitLossPercent.toFixed(2)}%
                </p>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">N/A</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Worst Performer
            </p>
            {stats.worstPerformer ? (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.worstPerformer.symbol}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  {stats.worstPerformer.profitLossPercent.toFixed(2)}%
                </p>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">N/A</p>
            )}
          </motion.div>
        </div>
      )}

      {/* Asset Allocation */}
      {allocation.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Asset Allocation
          </h2>
          <div className="flex h-12 rounded-lg overflow-hidden mb-4">
            {allocation.map((asset) => (
              <div
                key={asset.token}
                style={{
                  width: `${asset.percentage}%`,
                  backgroundColor: asset.color,
                }}
                className="transition-all hover:opacity-80"
                title={`${asset.token}: ${asset.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allocation.map((asset) => (
              <div key={asset.token} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: asset.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {asset.token}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {asset.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Positions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Positions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Avg Buy
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  P&L
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {positions.map((position, index) => (
                <motion.tr
                  key={position.tokenAddress}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {position.tokenSymbol}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">
                    {position.quantity.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">
                    ${position.averageBuyPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white font-semibold">
                    ${position.currentValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`font-semibold ${
                        position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {position.profitLoss >= 0 ? '+' : ''}$
                      {position.profitLoss.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${
                        position.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {position.profitLossPercent >= 0 ? '+' : ''}
                      {position.profitLossPercent.toFixed(2)}%
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

