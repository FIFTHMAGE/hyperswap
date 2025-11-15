/**
 * Transaction Card Component
 * Display transaction information in a card format
 */

'use client';

export interface TransactionCardProps {
  type: 'swap' | 'send' | 'receive';
  from?: string;
  to?: string;
  amount: string;
  token: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
}

export function TransactionCard({
  type,
  from,
  to,
  amount,
  token,
  timestamp,
  status,
  txHash,
}: TransactionCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'swap': return '🔄';
      case 'send': return '↑';
      case 'receive': return '↓';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
    }
  };

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getTypeIcon()}</span>
          <div>
            <div className="font-bold capitalize">{type}</div>
            <div className="text-sm text-gray-500">{formatTime(timestamp)}</div>
          </div>
        </div>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {status}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        {from && (
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">From:</span>
            <span className="font-mono">{from.slice(0, 6)}...{from.slice(-4)}</span>
          </div>
        )}
        {to && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">To:</span>
            <span className="font-mono">{to.slice(0, 6)}...{to.slice(-4)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          {amount} {token}
        </div>
        <a
          href={`https://solscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View →
        </a>
      </div>
    </div>
  );
}

