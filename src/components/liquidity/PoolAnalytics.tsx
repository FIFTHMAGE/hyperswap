/**
 * Pool analytics dashboard
 * @module components/liquidity/PoolAnalytics
 */

'use client';

import { styled } from 'nativewind';
import { Card } from '../ui';
import { formatUSD } from '@/utils/format/currency';
import { formatPercentage } from '@/utils/format/percentage';
import type { PoolAnalytics as PoolAnalyticsType } from '@/types/liquidity/pool';

interface PoolAnalyticsProps {
  analytics: PoolAnalyticsType;
}

const PoolAnalytics: React.FC<PoolAnalyticsProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pool Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Total Value Locked</p>
          <p className="text-2xl font-bold">{formatUSD(analytics.tvl)}</p>
          <p className="text-sm text-green-600 mt-1">
            +{formatPercentage(analytics.tvlChange24h)} 24h
          </p>
        </Card>

        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">24h Volume</p>
          <p className="text-2xl font-bold">{formatUSD(analytics.volume24h)}</p>
          <p className="text-sm text-green-600 mt-1">
            +{formatPercentage(analytics.volumeChange24h)} 24h
          </p>
        </Card>

        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">7d Volume</p>
          <p className="text-2xl font-bold">{formatUSD(analytics.volume7d)}</p>
        </Card>

        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">APR</p>
          <p className="text-2xl font-bold text-green-600">
            {formatPercentage(analytics.apr)}
          </p>
        </Card>
      </div>

      <Card padding="md">
        <h3 className="text-lg font-semibold mb-4">Historical Data</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart placeholder - integrate with Chart.js or Recharts
        </div>
      </Card>
    </div>
  );
};

export default styled(PoolAnalytics);

