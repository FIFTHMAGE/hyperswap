/**
 * Swap history list component
 * @module components/swap/SwapHistory
 */

'use client';

import { styled } from 'nativewind';

import { useSwapHistory } from '@/hooks/domain/useSwapHistory';
import { formatAddress } from '@/utils/format/address';
import { formatDate } from '@/utils/format/date';

import { Card, Badge } from '../ui';

const SwapHistory: React.FC = () => {
  const { history, refresh } = useSwapHistory();

  if (history.length === 0) {
    return (
      <Card padding="md">
        <div className="text-center py-8 text-gray-500">
          <p>No swap history</p>
          <p className="text-sm mt-2">Your swaps will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Swap History</h3>
        <button onClick={refresh} className="text-blue-600 hover:text-blue-700 text-sm">
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {history.map((swap) => (
          <div
            key={swap.hash}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">
                  {swap.fromAmount} {swap.fromToken}
                </span>
                <span className="text-gray-400">→</span>
                <span className="font-medium">
                  {swap.toAmount} {swap.toToken}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{formatDate(new Date(swap.timestamp * 1000))}</span>
                <span>•</span>
                <a
                  href={`https://etherscan.io/tx/${swap.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {formatAddress(swap.hash)}
                </a>
              </div>
            </div>

            <Badge
              variant={
                swap.status === 'success'
                  ? 'success'
                  : swap.status === 'failed'
                    ? 'error'
                    : 'warning'
              }
            >
              {swap.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default styled(SwapHistory);
