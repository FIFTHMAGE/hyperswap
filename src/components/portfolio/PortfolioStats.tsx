/**
 * Portfolio statistics widget
 * @module components/portfolio/PortfolioStats
 */

'use client';

import { styled } from 'nativewind';
import { Card } from '../ui';
import { formatUSD } from '@/utils/format/currency';
import { formatNumber } from '@/utils/format/number';

interface PortfolioStatsProps {
  totalTransactions: number;
  totalSwaps: number;
  totalGasSpent: number;
  averageTransactionValue: number;
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  totalTransactions,
  totalSwaps,
  totalGasSpent,
  averageTransactionValue,
}) => {
  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold mb-4">Portfolio Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold">{formatNumber(totalTransactions)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Swaps</p>
          <p className="text-2xl font-bold">{formatNumber(totalSwaps)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Gas Spent</p>
          <p className="text-2xl font-bold">{formatUSD(totalGasSpent)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
          <p className="text-2xl font-bold">{formatUSD(averageTransactionValue)}</p>
        </div>
      </div>
    </Card>
  );
};

export default styled(PortfolioStats);

