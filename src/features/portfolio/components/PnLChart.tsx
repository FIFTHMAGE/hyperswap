/**
 * Portfolio P&L chart component
 * @module components/portfolio/PnLChart
 */

'use client';

import { styled } from 'nativewind';
import { useState } from 'react';

import { formatUSD } from '@/utils/format/currency';

import { Card } from '../ui';

type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

const PnLChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const timeRanges: TimeRange[] = ['24h', '7d', '30d', '90d', '1y', 'all'];

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Portfolio Performance</h3>

        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
        Chart placeholder - integrate with Chart.js, Recharts, or similar
        <br />
        Time range: {timeRange}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-600">Highest Value</p>
          <p className="text-lg font-semibold">{formatUSD(125430)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Lowest Value</p>
          <p className="text-lg font-semibold">{formatUSD(98230)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average</p>
          <p className="text-lg font-semibold">{formatUSD(112340)}</p>
        </div>
      </div>
    </Card>
  );
};

export default styled(PnLChart);
