/**
 * Recent swaps widget
 * @module components/swap/RecentSwaps
 */

'use client';

import { styled } from 'nativewind';
import { Card } from '../ui';
import { useSwapHistory } from '@/hooks/domain/useSwapHistory';

const RecentSwaps: React.FC = () => {
  const { history } = useSwapHistory();
  const recentSwaps = history.slice(0, 5);

  if (recentSwaps.length === 0) {
    return (
      <Card padding="md">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Recent Swaps</h4>
        <p className="text-sm text-gray-500 text-center py-4">No recent swaps</p>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h4 className="text-sm font-medium text-gray-600 mb-3">Recent Swaps</h4>
      <div className="space-y-2">
        {recentSwaps.map((swap) => (
          <div
            key={swap.hash}
            className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>{swap.fromToken}</span>
              <span className="text-gray-400">→</span>
              <span>{swap.toToken}</span>
            </div>
            <div className={`text-xs ${
              swap.status === 'success' ? 'text-green-600' :
              swap.status === 'failed' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {swap.status === 'pending' ? '⏳' : swap.status === 'success' ? '✓' : '✕'}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default styled(RecentSwaps);

