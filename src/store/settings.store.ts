/**
 * Settings state management store
 * @module store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  slippage: number;
  deadline: number;
  expertMode: boolean;
  soundEnabled: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  setSlippage: (slippage: number) => void;
  setDeadline: (deadline: number) => void;
  toggleExpertMode: () => void;
  toggleSound: () => void;
  reset: () => void;
}

const initialState = {
  theme: 'system' as const,
  currency: 'USD',
  language: 'en',
  slippage: 0.5,
  deadline: 20,
  expertMode: false,
  soundEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setSlippage: (slippage) => set({ slippage }),
      setDeadline: (deadline) => set({ deadline }),
      toggleExpertMode: () => set((state) => ({ expertMode: !state.expertMode })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      reset: () => set(initialState),
    }),
    {
      name: 'settings-store',
    }
  )
);
