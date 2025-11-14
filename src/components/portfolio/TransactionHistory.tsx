/**
 * Transaction history component
 * @module components/portfolio/TransactionHistory
 */

'use client';

import { styled } from 'nativewind';
import { Card, Badge } from '../ui';
import { useTransactionHistory } from '@/hooks/domain/useTransactionHistory';
import { useWallet } from '@/hooks/core/useWallet';
import { formatAddress } from '@/utils/format/address';
import { formatDate } from '@/utils/format/date';
import { formatUSD } from '@/utils/format/currency';

const TransactionHistory: React.FC = () => {
  const { wallet } = useWallet();
  const { transactions, loading, loadMore, hasMore } = useTransactionHistory(wallet?.address || '');

  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={
                  tx.type === 'swap' ? 'info' :
                  tx.type === 'send' ? 'warning' :
                  'success'
                }>
                  {tx.type}
                </Badge>
                <span className="text-sm text-gray-600">{formatDate(new Date(tx.timestamp * 1000))}</span>
              </div>

              <p className="text-sm mb-1">
                {tx.description || `${tx.type} transaction`}
              </p>

              <a
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {formatAddress(tx.hash)}
              </a>
            </div>

            <div className="text-right">
              {tx.valueUSD && (
                <p className="font-semibold">{formatUSD(tx.valueUSD)}</p>
              )}
              <Badge
                variant={
                  tx.status === 'success' ? 'success' :
                  tx.status === 'failed' ? 'error' :
                  'warning'
                }
                size="sm"
              >
                {tx.status}
              </Badge>
            </div>
          </div>
        ))}

        {transactions.length === 0 && !loading && (
          <p className="text-center py-8 text-gray-500">No transactions found</p>
        )}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          Load More
        </button>
      )}
    </Card>
  );
};

export default styled(TransactionHistory);

