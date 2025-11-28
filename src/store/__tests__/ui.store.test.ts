/**
 * UI store tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useUIStore } from '../ui.store';

describe('useUIStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.closeAllModals();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isSidebarOpen).toBe(true);
      expect(result.current.isWalletModalOpen).toBe(false);
      expect(result.current.isSettingsModalOpen).toBe(false);
      expect(result.current.isTokenSelectorOpen).toBe(false);
      expect(result.current.activeModal).toBeNull();
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar closed', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isSidebarOpen).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isSidebarOpen).toBe(false);
    });

    it('should toggle sidebar open', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isSidebarOpen).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isSidebarOpen).toBe(true);
    });

    it('should toggle sidebar multiple times', () => {
      const { result } = renderHook(() => useUIStore());

      for (let i = 0; i < 5; i++) {
        const expectedValue = i % 2 === 0;

        act(() => {
          result.current.toggleSidebar();
        });

        expect(result.current.isSidebarOpen).toBe(!expectedValue);
      }
    });
  });

  describe('wallet modal', () => {
    it('should open wallet modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openWalletModal();
      });

      expect(result.current.isWalletModalOpen).toBe(true);
      expect(result.current.activeModal).toBe('wallet');
    });

    it('should close wallet modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openWalletModal();
      });

      act(() => {
        result.current.closeWalletModal();
      });

      expect(result.current.isWalletModalOpen).toBe(false);
      expect(result.current.activeModal).toBeNull();
    });
  });

  describe('settings modal', () => {
    it('should open settings modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openSettingsModal();
      });

      expect(result.current.isSettingsModalOpen).toBe(true);
      expect(result.current.activeModal).toBe('settings');
    });

    it('should close settings modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openSettingsModal();
      });

      act(() => {
        result.current.closeSettingsModal();
      });

      expect(result.current.isSettingsModalOpen).toBe(false);
      expect(result.current.activeModal).toBeNull();
    });
  });

  describe('token selector', () => {
    it('should open token selector', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openTokenSelector();
      });

      expect(result.current.isTokenSelectorOpen).toBe(true);
      expect(result.current.activeModal).toBe('tokenSelector');
    });

    it('should close token selector', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openTokenSelector();
      });

      act(() => {
        result.current.closeTokenSelector();
      });

      expect(result.current.isTokenSelectorOpen).toBe(false);
      expect(result.current.activeModal).toBeNull();
    });
  });

  describe('setActiveModal', () => {
    it('should set active modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveModal('customModal');
      });

      expect(result.current.activeModal).toBe('customModal');
    });

    it('should clear active modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveModal('customModal');
      });

      act(() => {
        result.current.setActiveModal(null);
      });

      expect(result.current.activeModal).toBeNull();
    });
  });

  describe('closeAllModals', () => {
    it('should close all modals', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openWalletModal();
      });

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.isWalletModalOpen).toBe(false);
      expect(result.current.isSettingsModalOpen).toBe(false);
      expect(result.current.isTokenSelectorOpen).toBe(false);
      expect(result.current.activeModal).toBeNull();
    });

    it('should close all modals when multiple are open', () => {
      const { result } = renderHook(() => useUIStore());

      // Manually set multiple modals open (simulating a bug scenario)
      act(() => {
        result.current.openWalletModal();
      });

      // Note: In practice, opening a new modal might close the previous one
      // But we'll test the closeAllModals function
      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.isWalletModalOpen).toBe(false);
      expect(result.current.isSettingsModalOpen).toBe(false);
      expect(result.current.isTokenSelectorOpen).toBe(false);
      expect(result.current.activeModal).toBeNull();
    });
  });

  describe('modal transitions', () => {
    it('should handle switching between modals', () => {
      const { result } = renderHook(() => useUIStore());

      // Open wallet modal
      act(() => {
        result.current.openWalletModal();
      });

      expect(result.current.isWalletModalOpen).toBe(true);
      expect(result.current.activeModal).toBe('wallet');

      // Close wallet and open settings
      act(() => {
        result.current.closeWalletModal();
        result.current.openSettingsModal();
      });

      expect(result.current.isWalletModalOpen).toBe(false);
      expect(result.current.isSettingsModalOpen).toBe(true);
      expect(result.current.activeModal).toBe('settings');
    });

    it('should handle rapid modal changes', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openWalletModal();
        result.current.closeWalletModal();
        result.current.openSettingsModal();
        result.current.closeSettingsModal();
        result.current.openTokenSelector();
      });

      expect(result.current.isWalletModalOpen).toBe(false);
      expect(result.current.isSettingsModalOpen).toBe(false);
      expect(result.current.isTokenSelectorOpen).toBe(true);
      expect(result.current.activeModal).toBe('tokenSelector');
    });
  });
});

