/**
 * Token Card Component
 * Display token information in a card format
 */

'use client';

export interface TokenCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  logoUrl?: string;
  onClick?: () => void;
}

export function TokenCard({
  symbol,
  name,
  price,
  change24h,
  volume24h,
  logoUrl,
  onClick,
}: TokenCardProps) {
  const isPositive = change24h >= 0;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl p-4 shadow-md border border-gray-200
        transition-all duration-200 hover:shadow-lg hover:scale-105
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        {logoUrl ? (
          <img src={logoUrl} alt={symbol} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
            {symbol.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="font-bold text-lg">{symbol}</div>
          <div className="text-sm text-gray-500">{name}</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-2xl font-bold">${price.toFixed(2)}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}%
        </div>
        <div className="text-xs text-gray-500">
          Vol: ${(volume24h / 1e6).toFixed(2)}M
        </div>
      </div>
    </div>
  );
}

