/**
 * Wallet connection hook
 * @module hooks/core/useWallet
 */

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import type { ConnectedWallet } from '@/types/user/wallet';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);

  useEffect(() => {
    if (address && isConnected) {
      setWallet({
        address,
        chainId,
        isConnected: true,
        connector: 'unknown',
      });
    } else {
      setWallet(null);
    }
  }, [address, isConnected, chainId]);

  const connectWallet = async () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setWallet(null);
  };

  return {
    wallet,
    address,
    chainId,
    isConnected,
    isConnecting,
    connect: connectWallet,
    disconnect: disconnectWallet,
  };
}

