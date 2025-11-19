import { create } from 'zustand';

interface SwapState {
  fromToken: string | null;
  toToken: string | null;
  amount: string;
  setFromToken: (token: string | null) => void;
  setToToken: (token: string | null) => void;
  setAmount: (amount: string) => void;
  swap: () => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  fromToken: null,
  toToken: null,
  amount: '',
  setFromToken: (fromToken) => set({ fromToken }),
  setToToken: (toToken) => set({ toToken }),
  setAmount: (amount) => set({ amount }),
  swap: () => {
    // Swap logic
  },
}));
