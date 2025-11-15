/**
 * Mobile Portfolio View
 * Optimized portfolio display for mobile devices
 */

'use client';

import { useState } from 'react';

interface TokenHolding {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  changePercent24h: number;
  logoUrl?: string;
}

interface MobilePortfolioViewProps {
  holdings: TokenHolding[];
  totalValue: number;
  change24h: number;
  changePercent24h: number;
  isLoading?: boolean;
}

export function MobilePortfolioView({
  holdings,
  totalValue,
  change24h,
  changePercent24h,
  isLoading = false,
}: MobilePortfolioViewProps) {
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'name'>('value');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  const sortedHoldings = [...holdings].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.value - a.value;
      case 'change':
        return b.changePercent24h - a.changePercent24h;
      case 'name':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-xl">
        <div className="mb-2 text-sm opacity-90">Total Portfolio Value</div>
        <div className="text-4xl font-bold mb-2">{formatCurrency(totalValue)}</div>
        <div className={`flex items-center gap-2 text-lg ${changePercent24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
          <span>{changePercent24h >= 0 ? '↑' : '↓'}</span>
          <span className="font-semibold">{formatPercent(Math.abs(changePercent24h))}</span>
          <span className="opacity-75">({formatCurrency(Math.abs(change24h))} 24h)</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-xs opacity-75 mb-1">Assets</div>
            <div className="text-xl font-bold">{holdings.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-xs opacity-75 mb-1">Best</div>
            <div className="text-xl font-bold text-green-300">
              {formatPercent(Math.max(...holdings.map(h => h.changePercent24h)))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-xs opacity-75 mb-1">Worst</div>
            <div className="text-xl font-bold text-red-300">
              {formatPercent(Math.min(...holdings.map(h => h.changePercent24h)))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Your Assets</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              ☰
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              ⊞
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSortBy('value')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${sortBy === 'value' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            By Value
          </button>
          <button
            onClick={() => setSortBy('change')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${sortBy === 'change' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            By Change
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            By Name
          </button>
        </div>
      </div>

      {/* Holdings */}
      {viewMode === 'list' ? (
        <div className="p-4 space-y-3">
          {sortedHoldings.map((holding, index) => (
            <div
              key={holding.symbol}
              className="bg-white rounded-2xl p-4 shadow-sm active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Token Logo */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold shadow-md">
                  {holding.logoUrl ? (
                    <img src={holding.logoUrl} alt={holding.symbol} className="w-full h-full rounded-full" />
                  ) : (
                    holding.symbol.charAt(0)
                  )}
                </div>

                {/* Token Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg">{holding.symbol}</div>
                  <div className="text-sm text-gray-500 truncate">{holding.name}</div>
                </div>

                {/* Value */}
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(holding.value)}</div>
                  <div className="text-sm text-gray-500">{holding.balance.toFixed(4)}</div>
                </div>
              </div>

              {/* Change & Progress */}
              <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${holding.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(holding.changePercent24h)} 24h
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(Math.abs(holding.change24h))}
                </div>
              </div>

              {/* Portfolio percentage bar */}
              <div className="mt-2 relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${(holding.value / totalValue) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((holding.value / totalValue) * 100).toFixed(2)}% of portfolio
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-3">
          {sortedHoldings.map((holding) => (
            <div
              key={holding.symbol}
              className="bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
            >
              {/* Token Logo */}
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold shadow-md">
                {holding.logoUrl ? (
                  <img src={holding.logoUrl} alt={holding.symbol} className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-2xl">{holding.symbol.charAt(0)}</span>
                )}
              </div>

              {/* Token Info */}
              <div className="text-center mb-2">
                <div className="font-bold text-lg">{holding.symbol}</div>
                <div className="text-xs text-gray-500 truncate">{holding.name}</div>
              </div>

              {/* Value */}
              <div className="text-center mb-2">
                <div className="font-bold">{formatCurrency(holding.value)}</div>
                <div className={`text-sm font-medium ${holding.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(holding.changePercent24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

