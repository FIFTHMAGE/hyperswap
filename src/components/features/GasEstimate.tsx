/**
 * Gas estimate display component
 * @module components/features
 */

'use client';

interface GasEstimateProps {
  estimatedGas: string;
  gasPriceGwei: string;
  estimatedCost: string;
  currency?: string;
  showDetails?: boolean;
  className?: string;
}

export function GasEstimate({
  estimatedGas,
  gasPriceGwei,
  estimatedCost,
  currency = 'USD',
  showDetails = false,
  className = '',
}: GasEstimateProps) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Gas</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {estimatedCost} {currency}
        </span>
      </div>
      {showDetails && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Gas Limit:</span>
            <span>{estimatedGas}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Gas Price:</span>
            <span>{gasPriceGwei} Gwei</span>
          </div>
        </div>
      )}
    </div>
  );
}
