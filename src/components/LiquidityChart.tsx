/**
 * LiquidityChart Component
 * Display liquidity pool visualization
 */

import React, { useMemo } from 'react';

export interface LiquidityChartProps {
  token0: {
    symbol: string;
    amount: string;
    valueUSD: number;
    logoURI?: string;
  };
  token1: {
    symbol: string;
    amount: string;
    valueUSD: number;
    logoURI?: string;
  };
  totalValueUSD: number;
  userShare?: number;
  fee?: number;
  apy?: number;
  volume24h?: number;
  showDetails?: boolean;
  className?: string;
}

export const LiquidityChart: React.FC<LiquidityChartProps> = ({
  token0,
  token1,
  totalValueUSD,
  userShare,
  fee,
  apy,
  volume24h,
  showDetails = true,
  className = '',
}) => {
  const token0Percentage = useMemo(() => {
    if (totalValueUSD === 0) return 50;
    return (token0.valueUSD / totalValueUSD) * 100;
  }, [token0.valueUSD, totalValueUSD]);

  const token1Percentage = useMemo(() => {
    if (totalValueUSD === 0) return 50;
    return (token1.valueUSD / totalValueUSD) * 100;
  }, [token1.valueUSD, totalValueUSD]);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(4);
  };

  return (
    <div className={`bg-slate-900 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-900">
              {token0.logoURI ? (
                <img src={token0.logoURI} alt={token0.symbol} className="w-full h-full rounded-full" />
              ) : (
                token0.symbol.slice(0, 2)
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-900">
              {token1.logoURI ? (
                <img src={token1.logoURI} alt={token1.symbol} className="w-full h-full rounded-full" />
              ) : (
                token1.symbol.slice(0, 2)
              )}
            </div>
          </div>
          <span className="text-lg font-semibold text-white">
            {token0.symbol}/{token1.symbol}
          </span>
          {fee && (
            <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-gray-400">
              {(fee / 10000).toFixed(2)}%
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatValue(totalValueUSD)}</p>
          <p className="text-sm text-gray-400">Total Value</p>
        </div>
      </div>

      {/* Liquidity Bar */}
      <div className="mb-6">
        <div className="h-12 rounded-lg overflow-hidden flex">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center transition-all duration-500"
            style={{ width: `${token0Percentage}%` }}
          >
            {token0Percentage > 15 && (
              <span className="text-white text-sm font-medium">
                {token0Percentage.toFixed(1)}%
              </span>
            )}
          </div>
          <div 
            className="bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center transition-all duration-500"
            style={{ width: `${token1Percentage}%` }}
          >
            {token1Percentage > 15 && (
              <span className="text-white text-sm font-medium">
                {token1Percentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Token Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
              {token0.logoURI ? (
                <img src={token0.logoURI} alt={token0.symbol} className="w-full h-full rounded-full" />
              ) : (
                token0.symbol.slice(0, 1)
              )}
            </div>
            <span className="font-medium text-white">{token0.symbol}</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatAmount(token0.amount)}</p>
          <p className="text-sm text-gray-400">{formatValue(token0.valueUSD)}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
              {token1.logoURI ? (
                <img src={token1.logoURI} alt={token1.symbol} className="w-full h-full rounded-full" />
              ) : (
                token1.symbol.slice(0, 1)
              )}
            </div>
            <span className="font-medium text-white">{token1.symbol}</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatAmount(token1.amount)}</p>
          <p className="text-sm text-gray-400">{formatValue(token1.valueUSD)}</p>
        </div>
      </div>

      {/* Stats */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          {userShare !== undefined && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Your Share</p>
              <p className="text-lg font-semibold text-white">{userShare.toFixed(4)}%</p>
            </div>
          )}
          {apy !== undefined && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">APY</p>
              <p className={`text-lg font-semibold ${apy > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                {apy.toFixed(2)}%
              </p>
            </div>
          )}
          {volume24h !== undefined && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">24h Volume</p>
              <p className="text-lg font-semibold text-white">{formatValue(volume24h)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(LiquidityChart);

