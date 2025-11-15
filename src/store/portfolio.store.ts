/**
 * Portfolio state management store
 * @module store
 */

import { create } from 'zustand';

import type { TokenBalance } from '@/types/domain.types';

interface PortfolioState {
  balances: TokenBalance[];
  totalValue: number;
  isLoading: boolean;
  lastUpdated: number | null;
  setBalances: (balances: TokenBalance[]) => void;
  setTotalValue: (value: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateBalance: (tokenAddress: string, balance: string) => void;
  refresh: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  balances: [],
  totalValue: 0,
  isLoading: false,
  lastUpdated: null,
  setBalances: (balances) => set({ balances, lastUpdated: Date.now() }),
  setTotalValue: (value) => set({ totalValue: value }),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateBalance: (tokenAddress, balance) =>
    set((state) => ({
      balances: state.balances.map((b) =>
        b.token.address === tokenAddress ? { ...b, balance } : b
      ),
    })),
  refresh: () => set({ isLoading: true }),
}));
