'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiquidityPool, PoolFilters } from '@/lib/types/liquidity';
import { liquidityService } from '@/lib/api/liquidity-service';

export function PoolDiscovery() {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PoolFilters>({
    sortBy: 'tvl',
    sortDirection: 'desc',
  });

  useEffect(() => {
    loadPools();
  }, [filters]);

  const loadPools = async () => {
    setLoading(true);
    try {
      const data = await liquidityService.discoverPools(filters);
      setPools(data);
    } catch (error) {
      console.error('Error loading pools:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Liquidity Pools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and analyze liquidity pools across multiple protocols
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortBy: e.target.value as any,
              })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="tvl">Sort by TVL</option>
            <option value="volume">Sort by Volume</option>
            <option value="apy">Sort by APY</option>
            <option value="fees">Sort by Fees</option>
          </select>

          <input
            type="number"
            placeholder="Min TVL"
            onChange={(e) =>
              setFilters({
                ...filters,
                minTVL: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <input
            type="number"
            placeholder="Min APY %"
            onChange={(e) =>
              setFilters({
                ...filters,
                minAPY: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Pool List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pools...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800">
                      {pool.token0.symbol[0]}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800">
                      {pool.token1.symbol[0]}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {pool.token0.symbol} / {pool.token1.symbol}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {pool.protocol} • {pool.fee}% fee
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">TVL</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(pool.tvl)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Volume 24h
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(pool.volume24h)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">APY</p>
                    <p className="text-lg font-bold text-green-600">
                      {pool.apy.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fees 24h
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(pool.fees24h)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {pools.length === 0 && !loading && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400">
                No pools found matching your criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

