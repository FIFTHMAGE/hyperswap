/**
 * Wallet context provider
 * @module contexts
 */

'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const connect = async () => {
    // Mock implementation - replace with actual wallet connection logic
    setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
    setChainId(1);
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
  };

  const switchChain = async (newChainId: number) => {
    // Mock implementation - replace with actual chain switching logic
    setChainId(newChainId);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isConnected: !!address,
        connect,
        disconnect,
        switchChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
