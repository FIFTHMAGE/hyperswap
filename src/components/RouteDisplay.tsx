/**
 * RouteDisplay Component
 * Visualize swap route path
 */

import React from 'react';

export interface Token {
  address: string;
  symbol: string;
  logoURI?: string;
}

export interface RouteStep {
  fromToken: Token;
  toToken: Token;
  pool: string;
  protocol: string;
  fee: number;
  percentage?: number;
}

export interface RouteDisplayProps {
  steps: RouteStep[];
  fromAmount?: string;
  toAmount?: string;
  showDetails?: boolean;
  isMultiRoute?: boolean;
  className?: string;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  steps,
  fromAmount,
  toAmount,
  showDetails = false,
  isMultiRoute = false,
  className = '',
}) => {
  if (steps.length === 0) return null;

  const getProtocolColor = (protocol: string): string => {
    const colors: Record<string, string> = {
      uniswap_v3: 'bg-pink-500',
      uniswap_v2: 'bg-pink-400',
      sushiswap: 'bg-purple-500',
      curve: 'bg-yellow-500',
      balancer: 'bg-gray-700',
      '1inch': 'bg-blue-500',
    };
    return colors[protocol.toLowerCase()] || 'bg-gray-500';
  };

  const formatFee = (fee: number): string => {
    return `${(fee / 10000).toFixed(2)}%`;
  };

  const TokenBadge: React.FC<{ token: Token }> = ({ token }) => (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-xl">
      {token.logoURI ? (
        <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {token.symbol.slice(0, 2)}
        </div>
      )}
      <span className="font-medium text-white">{token.symbol}</span>
    </div>
  );

  return (
    <div className={`bg-slate-800/50 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-400">Route</h4>
        {isMultiRoute && (
          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
            Split Route
          </span>
        )}
      </div>

      {/* Simple Route View */}
      {!showDetails && (
        <div className="flex items-center gap-2 flex-wrap">
          <TokenBadge token={steps[0].fromToken} />
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className={`w-2 h-2 rounded-full ${getProtocolColor(step.protocol)}`} />
              </div>
              <TokenBadge token={step.toToken} />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Detailed Route View */}
      {showDetails && (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TokenBadge token={step.fromToken} />
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <TokenBadge token={step.toToken} />
                </div>
                {step.percentage && step.percentage < 100 && (
                  <span className="text-sm text-gray-400">{step.percentage}%</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getProtocolColor(step.protocol)}`} />
                  <span className="capitalize">{step.protocol.replace('_', ' ')}</span>
                </div>
                <span>Fee: {formatFee(step.fee)}</span>
                <span className="font-mono text-gray-500">
                  {step.pool.slice(0, 6)}...{step.pool.slice(-4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Amount Summary */}
      {(fromAmount || toAmount) && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-sm">
          {fromAmount && (
            <div>
              <span className="text-gray-400">Input:</span>{' '}
              <span className="text-white font-medium">{fromAmount} {steps[0].fromToken.symbol}</span>
            </div>
          )}
          {toAmount && (
            <div className="text-right">
              <span className="text-gray-400">Output:</span>{' '}
              <span className="text-green-400 font-medium">{toAmount} {steps[steps.length - 1].toToken.symbol}</span>
            </div>
          )}
        </div>
      )}

      {/* Protocol Legend */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="flex flex-wrap gap-3">
            {['Uniswap V3', 'Sushiswap', 'Curve', 'Balancer'].map((protocol) => (
              <div key={protocol} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${getProtocolColor(protocol.toLowerCase().replace(' ', '_'))}`} />
                <span>{protocol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(RouteDisplay);

