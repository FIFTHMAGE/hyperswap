/**
 * Portfolio overview dashboard
 * @module components/portfolio/PortfolioOverview
 */

'use client';

import { styled } from 'nativewind';
import { Card } from '../ui';
import { usePortfolio } from '@/hooks/domain/usePortfolio';
import { useWallet } from '@/hooks/core/useWallet';
import { formatUSD } from '@/utils/format/currency';
import { formatPercentage } from '@/utils/format/percentage';

const PortfolioOverview: React.FC = () => {
  const { wallet } = useWallet();
  const { portfolio, loading } = usePortfolio(wallet?.address || '', [1, 137, 42161]);

  if (!wallet) {
    return (
      <Card padding="lg">
        <p className="text-center text-gray-600">Connect wallet to view portfolio</p>
      </Card>
    );
  }

  if (loading) {
    return <Card padding="lg"><p className="text-center">Loading portfolio...</p></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Total Balance</p>
          <p className="text-3xl font-bold">{formatUSD(portfolio.totalBalance)}</p>
          <p className="text-sm text-green-600 mt-1">
            +{formatPercentage(portfolio.change24h)} 24h
          </p>
        </Card>

        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Total Chains</p>
          <p className="text-3xl font-bold">{portfolio.chains.length}</p>
        </Card>

        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
          <p className="text-3xl font-bold">{portfolio.tokens.length}</p>
        </Card>

        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">24h P&L</p>
          <p className={`text-3xl font-bold ${portfolio.pnl24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolio.pnl24h >= 0 ? '+' : ''}{formatUSD(portfolio.pnl24h)}
          </p>
        </Card>
      </div>

      <Card padding="md">
        <h3 className="text-lg font-semibold mb-4">Chain Distribution</h3>
        <div className="space-y-3">
          {portfolio.chains.map((chain) => (
            <div key={chain.chainId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>{chain.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatUSD(chain.balance)}</p>
                <p className="text-sm text-gray-600">{formatPercentage(chain.percentage)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default styled(PortfolioOverview);

