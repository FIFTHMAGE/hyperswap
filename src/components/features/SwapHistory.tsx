'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSwapHistory } from '@/hooks/useSwapHistory';
import { HistoryFilters } from '@/lib/types/history';

export function SwapHistory() {
  const { history, loading, clearHistory, filterHistory } = useSwapHistory();
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredHistory = filterHistory(filters);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Swap History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredHistory.length} transaction{filteredHistory.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
          >
            🔍 Filters
          </button>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 font-semibold"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as any || undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <input
              type="date"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateFrom: e.target.value ? new Date(e.target.value).getTime() : undefined,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No swap history yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Your completed swaps will appear here
            </p>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <a
                  href={`https://etherscan.io/tx/${item.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
                >
                  View Tx →
                </a>
              </div>

              <div className="flex items-center gap-4">
                {/* Input Token */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.inputToken.logoURI && (
                      <img
                        src={item.inputToken.logoURI}
                        alt={item.inputToken.symbol}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.inputToken.symbol}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {parseFloat(item.inputToken.amount).toFixed(6)}
                  </p>
                  {item.inputValueUSD && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ≈ ${item.inputValueUSD.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="text-2xl text-gray-400">→</div>

                {/* Output Token */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.outputToken.logoURI && (
                      <img
                        src={item.outputToken.logoURI}
                        alt={item.outputToken.symbol}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.outputToken.symbol}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {parseFloat(item.outputToken.amount).toFixed(6)}
                  </p>
                  {item.outputValueUSD && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ≈ ${item.outputValueUSD.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="capitalize">via {item.provider}</span>
                {item.gasCostUSD && (
                  <span>Gas: ${item.gasCostUSD.toFixed(4)}</span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

