/**
 * Wallet connection button component
 * @module components/features
 */

'use client';

interface WalletButtonProps {
  isConnected: boolean;
  address?: string;
  balance?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export function WalletButton({
  isConnected,
  address,
  balance,
  onConnect,
  onDisconnect,
  className = '',
}: WalletButtonProps) {
  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {balance && (
          <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
            {balance} ETH
          </span>
        )}
        <button
          onClick={onDisconnect}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {formatAddress(address)}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${className}`}
    >
      Connect Wallet
    </button>
  );
}
