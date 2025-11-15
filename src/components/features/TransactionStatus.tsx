/**
 * Transaction status indicator component
 * @module components/features
 */

'use client';

interface TransactionStatusProps {
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  explorerUrl?: string;
  className?: string;
}

export function TransactionStatus({
  status,
  txHash,
  explorerUrl,
  className = '',
}: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      icon: (
        <svg className="animate-spin w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ),
      label: 'Pending',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    confirmed: {
      icon: (
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: 'Confirmed',
      color: 'text-green-600 dark:text-green-400',
    },
    failed: {
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      label: 'Failed',
      color: 'text-red-600 dark:text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        {config.icon}
        <span className={`font-medium ${config.color}`}>{config.label}</span>
      </div>
      {txHash && explorerUrl && (
        <a
          href={`${explorerUrl}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View on Explorer
        </a>
      )}
    </div>
  );
}
