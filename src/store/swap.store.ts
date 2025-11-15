/**
 * Swap state management store
 * @module store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Token } from '@/types/blockchain.types';

interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  deadline: number;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setDeadline: (deadline: number) => void;
  swapTokens: () => void;
  reset: () => void;
}

const initialState = {
  fromToken: null,
  toToken: null,
  fromAmount: '',
  toAmount: '',
  slippage: 0.5,
  deadline: 20,
};

export const useSwapStore = create<SwapState>()(
  persist(
    (set) => ({
      ...initialState,
      setFromToken: (token) => set({ fromToken: token }),
      setToToken: (token) => set({ toToken: token }),
      setFromAmount: (amount) => set({ fromAmount: amount }),
      setToAmount: (amount) => set({ toAmount: amount }),
      setSlippage: (slippage) => set({ slippage }),
      setDeadline: (deadline) => set({ deadline }),
      swapTokens: () =>
        set((state) => ({
          fromToken: state.toToken,
          toToken: state.fromToken,
          fromAmount: state.toAmount,
          toAmount: state.fromAmount,
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'swap-store',
    }
  )
);
