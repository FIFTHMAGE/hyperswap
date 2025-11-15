/**
 * Network badge component
 * @module components/features
 */

'use client';

interface NetworkBadgeProps {
  networkName: string;
  isTestnet?: boolean;
  className?: string;
}

export function NetworkBadge({
  networkName,
  isTestnet = false,
  className = '',
}: NetworkBadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
        ${
          isTestnet
            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
            : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
        }
        ${className}
      `}
    >
      <div className={`w-2 h-2 rounded-full ${isTestnet ? 'bg-yellow-600' : 'bg-green-600'}`} />
      <span>{networkName}</span>
      {isTestnet && <span className="text-xs">(Testnet)</span>}
    </div>
  );
}
