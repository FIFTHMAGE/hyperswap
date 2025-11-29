/**
 * PriceImpact Component
 * Display price impact warnings and information
 */

import React, { useMemo } from 'react';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface PriceImpactProps {
  impact: number;
  fromSymbol: string;
  toSymbol: string;
  exchangeRate?: number;
  showWarning?: boolean;
  showBreakdown?: boolean;
  className?: string;
}

export const PriceImpact: React.FC<PriceImpactProps> = ({
  impact,
  fromSymbol,
  toSymbol,
  exchangeRate,
  showWarning = true,
  showBreakdown = false,
  className = '',
}) => {
  const impactLevel = useMemo((): ImpactLevel => {
    if (impact < 1) return 'low';
    if (impact < 3) return 'medium';
    if (impact < 5) return 'high';
    return 'critical';
  }, [impact]);

  const impactConfig = useMemo(() => {
    const configs: Record<ImpactLevel, {
      color: string;
      bgColor: string;
      borderColor: string;
      icon: React.ReactNode;
      label: string;
      description: string;
    }> = {
      low: {
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Low Impact',
        description: 'This trade has minimal price impact.',
      },
      medium: {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Moderate Impact',
        description: 'Consider reducing trade size for better rates.',
      },
      high: {
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
        label: 'High Impact',
        description: 'This trade will significantly move the market price.',
      },
      critical: {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Very High Impact',
        description: 'Trade not recommended due to extreme price impact.',
      },
    };
    return configs[impactLevel];
  }, [impactLevel]);

  return (
    <div className={`${className}`}>
      {/* Impact Display */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${impactConfig.bgColor}`}>
        <div className="flex items-center gap-2">
          <span className={impactConfig.color}>{impactConfig.icon}</span>
          <span className={`text-sm font-medium ${impactConfig.color}`}>
            Price Impact
          </span>
        </div>
        <span className={`text-lg font-bold ${impactConfig.color}`}>
          {impact < 0.01 ? '< 0.01' : impact.toFixed(2)}%
        </span>
      </div>

      {/* Warning Banner */}
      {showWarning && impactLevel !== 'low' && (
        <div className={`mt-3 p-4 rounded-xl border ${impactConfig.bgColor} ${impactConfig.borderColor}`}>
          <div className="flex gap-3">
            <span className={impactConfig.color}>{impactConfig.icon}</span>
            <div>
              <p className={`font-medium ${impactConfig.color}`}>
                {impactConfig.label}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {impactConfig.description}
              </p>
              {impactLevel === 'critical' && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                  ⚠️ You may lose {impact.toFixed(1)}% of your trade value
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Breakdown */}
      {showBreakdown && exchangeRate && (
        <div className="mt-3 space-y-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Rate</span>
            <span className="text-gray-900 dark:text-white">
              1 {fromSymbol} = {exchangeRate.toFixed(6)} {toSymbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">After Impact</span>
            <span className={impactConfig.color}>
              1 {fromSymbol} ≈ {(exchangeRate * (1 - impact / 100)).toFixed(6)} {toSymbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Lost to Impact</span>
            <span className={impactConfig.color}>
              ~{(exchangeRate * impact / 100).toFixed(6)} {toSymbol}
            </span>
          </div>
        </div>
      )}

      {/* Impact Meter */}
      <div className="mt-3">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              impactLevel === 'low' ? 'bg-green-500' :
              impactLevel === 'medium' ? 'bg-yellow-500' :
              impactLevel === 'high' ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(impact * 10, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>5%</span>
          <span>10%+</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PriceImpact);

