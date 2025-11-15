/**
 * Asset card component for portfolio display
 * @module components/portfolio
 */

'use client';

interface AssetCardProps {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  priceChange24h: number;
  logoUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function AssetCard({
  symbol,
  name,
  balance,
  value,
  priceChange24h,
  logoUrl,
  onClick,
  className = '',
}: AssetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors text-left ${className}`}
    >
      <div className="flex items-center gap-3">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={symbol} className="w-10 h-10 rounded-full" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{symbol}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{name}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">${value}</div>
              <div
                className={`text-sm font-medium ${priceChange24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {priceChange24h >= 0 ? '+' : ''}
                {priceChange24h.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {balance} {symbol}
          </div>
        </div>
      </div>
    </button>
  );
}
