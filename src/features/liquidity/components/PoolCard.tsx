/**
 * Pool card component for displaying liquidity pool information
 * @module components/liquidity
 */

'use client';

interface PoolCardProps {
  poolName: string;
  token0Symbol: string;
  token1Symbol: string;
  tvl: string;
  apr: number;
  volume24h: string;
  onClick?: () => void;
  className?: string;
}

export function PoolCard({
  poolName,
  token0Symbol,
  token1Symbol,
  tvl,
  apr,
  volume24h,
  onClick,
  className = '',
}: PoolCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-lg text-gray-900 dark:text-white">{poolName}</div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {token0Symbol}/{token1Symbol}
          </span>
        </div>
        <div className="text-green-600 dark:text-green-400 font-semibold">
          {apr.toFixed(2)}% APR
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">TVL</div>
          <div className="font-medium text-gray-900 dark:text-white">${tvl}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">24h Volume</div>
          <div className="font-medium text-gray-900 dark:text-white">${volume24h}</div>
        </div>
      </div>
    </button>
  );
}
