import { create } from 'zustand';

interface UserState {
  address: string | null;
  balance: string | null;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  address: null,
  balance: null,
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
}));
