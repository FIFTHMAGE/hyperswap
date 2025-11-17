/**
 * Portfolio allocation pie chart
 * @module components/portfolio/AllocationChart
 */

'use client';

import { styled } from 'nativewind';

import { formatUSD } from '@/utils/format/currency';
import { formatPercentage } from '@/utils/format/percentage';

import { Card } from '../ui';

interface AllocationItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const AllocationChart: React.FC = () => {
  // Mock data - should come from props or hooks
  const allocations: AllocationItem[] = [
    { name: 'Ethereum', value: 45000, percentage: 0.45, color: '#627EEA' },
    { name: 'USDC', value: 30000, percentage: 0.3, color: '#2775CA' },
    { name: 'USDT', value: 15000, percentage: 0.15, color: '#26A17B' },
    { name: 'Others', value: 10000, percentage: 0.1, color: '#8B8B8B' },
  ];

  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="w-48 h-48 rounded-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
          Pie Chart
          <br />
          Placeholder
        </div>
      </div>

      <div className="space-y-3">
        {allocations.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span>{item.name}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatUSD(item.value)}</p>
              <p className="text-sm text-gray-600">{formatPercentage(item.percentage)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default styled(AllocationChart);
