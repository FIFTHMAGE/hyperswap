/**
 * UI store tests
 */

import { useUIStore } from '@/store/ui.store';

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.getState().closeAllModals();
  });

  test('toggles sidebar', () => {
    const initial = useUIStore.getState().isSidebarOpen;
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(!initial);
  });

  test('opens wallet modal', () => {
    useUIStore.getState().openWalletModal();
    expect(useUIStore.getState().isWalletModalOpen).toBe(true);
    expect(useUIStore.getState().activeModal).toBe('wallet');
  });

  test('closes wallet modal', () => {
    useUIStore.getState().openWalletModal();
    useUIStore.getState().closeWalletModal();
    expect(useUIStore.getState().isWalletModalOpen).toBe(false);
    expect(useUIStore.getState().activeModal).toBeNull();
  });

  test('opens settings modal', () => {
    useUIStore.getState().openSettingsModal();
    expect(useUIStore.getState().isSettingsModalOpen).toBe(true);
  });

  test('closes all modals', () => {
    useUIStore.getState().openWalletModal();
    useUIStore.getState().openSettingsModal();
    useUIStore.getState().closeAllModals();

    expect(useUIStore.getState().isWalletModalOpen).toBe(false);
    expect(useUIStore.getState().isSettingsModalOpen).toBe(false);
    expect(useUIStore.getState().activeModal).toBeNull();
  });
});
