/**
 * UI state management store
 * @module store
 */

import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isWalletModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isTokenSelectorOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  openTokenSelector: () => void;
  closeTokenSelector: () => void;
  setActiveModal: (modal: string | null) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isWalletModalOpen: false,
  isSettingsModalOpen: false,
  isTokenSelectorOpen: false,
  activeModal: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openWalletModal: () => set({ isWalletModalOpen: true, activeModal: 'wallet' }),
  closeWalletModal: () => set({ isWalletModalOpen: false, activeModal: null }),
  openSettingsModal: () => set({ isSettingsModalOpen: true, activeModal: 'settings' }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false, activeModal: null }),
  openTokenSelector: () => set({ isTokenSelectorOpen: true, activeModal: 'tokenSelector' }),
  closeTokenSelector: () => set({ isTokenSelectorOpen: false, activeModal: null }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  closeAllModals: () =>
    set({
      isWalletModalOpen: false,
      isSettingsModalOpen: false,
      isTokenSelectorOpen: false,
      activeModal: null,
    }),
}));
