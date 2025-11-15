/**
 * useWalletConnect hook - Wallet connection management
 * @module hooks/features
 */

import { useState } from 'react';

import { useWalletStore } from '@/store/wallet.store';

export function useWalletConnect() {
  const [error, setError] = useState<Error | null>(null);

  const {
    address,
    chainId,
    balance,
    isConnected,
    isConnecting,
    setAddress,
    setChainId,
    setBalance,
    setIsConnected,
    setIsConnecting,
    disconnect,
  } = useWalletStore();

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      const mockChainId = 1;
      const mockBalance = (Math.random() * 10).toFixed(4);

      setAddress(mockAddress);
      setChainId(mockChainId);
      setBalance(mockBalance);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Connection failed'));
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const switchChain = async (newChainId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setChainId(newChainId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to switch chain'));
      throw err;
    }
  };

  return {
    address,
    chainId,
    balance,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchChain,
    error,
  };
}
