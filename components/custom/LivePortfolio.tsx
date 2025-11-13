/**
 * Live Portfolio Display
 * Real-time portfolio value and holdings visualization
 */

'use client';

import { useRealtimePortfolio } from '@/hooks/useRealtimePortfolio';
import { useState } from 'react';

interface LivePortfolioProps {
  walletAddress: string;
  chain?: string;
  showChart?: boolean;
  compact?: boolean;
}

export function LivePortfolio({ 
  walletAddress, 
  chain = 'solana',
  showChart = true,
  compact = false 
}: LivePortfolioProps) {
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'name'>('value');
  
  const {
    portfolio,
    isLoading,
    error,
    isConnected,
    getHoldingPercentage,
    getTopHoldings,
    getDiversificationScore,
    refresh,
  } = useRealtimePortfolio({ walletAddress, chain, updateInterval: 5000 });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading portfolio: {error}</p>
        <button
          onClick={refresh}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading || !portfolio) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-6 animate-pulse h-32" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-16" />
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const sortedHoldings = [...portfolio.holdings].sort((a, b) => {
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

  const diversificationScore = getDiversificationScore();
  const topHoldings = getTopHoldings(3);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
          </div>
          <div className={`text-right ${portfolio.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <div className="text-sm">{formatPercent(portfolio.changePercent24h)}</div>
            <div className="text-xs">{formatCurrency(portfolio.change24h)}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {topHoldings.map((holding) => (
            <div key={holding.token} className="flex justify-between text-sm">
              <span className="font-medium">{holding.symbol}</span>
              <span>{formatCurrency(holding.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-3xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">24h Change</div>
            <div className={`text-2xl font-bold ${portfolio.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(portfolio.changePercent24h)}
            </div>
            <div className="text-sm text-gray-500">{formatCurrency(portfolio.change24h)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Diversification</div>
            <div className="text-2xl font-bold">{diversificationScore}/100</div>
            <div className="text-sm text-gray-500">{portfolio.holdings.length} assets</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('value')}
              className={`px-3 py-1 rounded text-sm ${sortBy === 'value' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              By Value
            </button>
            <button
              onClick={() => setSortBy('change')}
              className={`px-3 py-1 rounded text-sm ${sortBy === 'change' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              By Change
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 rounded text-sm ${sortBy === 'name' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              By Name
            </button>
          </div>
          <button
            onClick={refresh}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Holdings List */}
      <div className="divide-y divide-gray-200">
        {sortedHoldings.map((holding) => {
          const percentage = getHoldingPercentage(holding);
          return (
            <div key={holding.token} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium">{holding.symbol}</div>
                  <div className="text-sm text-gray-500">
                    {holding.balance.toLocaleString()} tokens
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(holding.value)}</div>
                  <div className="text-sm text-gray-500">{percentage.toFixed(2)}%</div>
                </div>
                <div className={`ml-4 text-right min-w-[80px] ${holding.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="font-medium">{formatPercent(holding.changePercent24h)}</div>
                  <div className="text-sm">{formatCurrency(holding.change24h)}</div>
                </div>
              </div>
              
              {/* Percentage bar */}
              <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center">
        Last updated: {new Date(portfolio.lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
}

