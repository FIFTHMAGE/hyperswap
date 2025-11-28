/**
 * Wallet store tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWalletStore } from '../wallet.store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useWalletStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    const { result } = renderHook(() => useWalletStore());
    act(() => {
      result.current.disconnect();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useWalletStore());

      expect(result.current.address).toBeNull();
      expect(result.current.chainId).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
    });
  });

  describe('setAddress', () => {
    it('should set address', () => {
      const { result } = renderHook(() => useWalletStore());
      const address = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setAddress(address);
      });

      expect(result.current.address).toBe(address);
    });

    it('should set address to null', () => {
      const { result } = renderHook(() => useWalletStore());
      const address = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setAddress(address);
      });

      act(() => {
        result.current.setAddress(null);
      });

      expect(result.current.address).toBeNull();
    });
  });

  describe('setChainId', () => {
    it('should set chainId', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setChainId(1);
      });

      expect(result.current.chainId).toBe(1);
    });

    it('should set chainId to different network', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setChainId(137);
      });

      expect(result.current.chainId).toBe(137);
    });

    it('should set chainId to null', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setChainId(1);
      });

      act(() => {
        result.current.setChainId(null);
      });

      expect(result.current.chainId).toBeNull();
    });
  });

  describe('setBalance', () => {
    it('should set balance', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setBalance('1.5');
      });

      expect(result.current.balance).toBe('1.5');
    });

    it('should handle large balance values', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setBalance('1000000.123456789012345678');
      });

      expect(result.current.balance).toBe('1000000.123456789012345678');
    });
  });

  describe('setIsConnected', () => {
    it('should set isConnected to true', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setIsConnected(true);
      });

      expect(result.current.isConnected).toBe(true);
    });

    it('should set isConnected to false', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setIsConnected(true);
      });

      act(() => {
        result.current.setIsConnected(false);
      });

      expect(result.current.isConnected).toBe(false);
    });
  });

  describe('setIsConnecting', () => {
    it('should set isConnecting to true', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setIsConnecting(true);
      });

      expect(result.current.isConnecting).toBe(true);
    });

    it('should set isConnecting to false', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setIsConnecting(true);
      });

      act(() => {
        result.current.setIsConnecting(false);
      });

      expect(result.current.isConnecting).toBe(false);
    });
  });

  describe('disconnect', () => {
    it('should reset all state on disconnect', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setAddress('0x1234567890123456789012345678901234567890');
        result.current.setChainId(1);
        result.current.setBalance('10.5');
        result.current.setIsConnected(true);
      });

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.address).toBeNull();
      expect(result.current.chainId).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
    });
  });

  describe('connection flow', () => {
    it('should handle full connection flow', () => {
      const { result } = renderHook(() => useWalletStore());

      // Start connecting
      act(() => {
        result.current.setIsConnecting(true);
      });

      expect(result.current.isConnecting).toBe(true);
      expect(result.current.isConnected).toBe(false);

      // Connection successful
      act(() => {
        result.current.setAddress('0x1234567890123456789012345678901234567890');
        result.current.setChainId(1);
        result.current.setBalance('5.0');
        result.current.setIsConnected(true);
        result.current.setIsConnecting(false);
      });

      expect(result.current.isConnecting).toBe(false);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.address).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should handle network switch', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setChainId(1);
        result.current.setIsConnected(true);
      });

      // Switch to Polygon
      act(() => {
        result.current.setChainId(137);
      });

      expect(result.current.chainId).toBe(137);
      expect(result.current.isConnected).toBe(true);
    });
  });

  describe('persistence', () => {
    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setAddress('0x1234567890123456789012345678901234567890');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});

