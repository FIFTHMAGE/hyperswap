/**
 * Wallet state management store
 * @module store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setBalance: (balance: string) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  disconnect: () => void;
}

const initialState = {
  address: null,
  chainId: null,
  balance: '0',
  isConnected: false,
  isConnecting: false,
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      ...initialState,
      setAddress: (address) => set({ address }),
      setChainId: (chainId) => set({ chainId }),
      setBalance: (balance) => set({ balance }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsConnecting: (isConnecting) => set({ isConnecting }),
      disconnect: () => set(initialState),
    }),
    {
      name: 'wallet-store',
    }
  )
);
