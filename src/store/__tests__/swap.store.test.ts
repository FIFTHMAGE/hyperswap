/**
 * Swap store tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSwapStore } from '../swap.store';

import type { Token } from '@/types/blockchain.types';

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

const mockToken1: Token = {
  address: '0x1234567890123456789012345678901234567890',
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  chainId: 1,
  logoURI: 'https://example.com/eth.png',
};

const mockToken2: Token = {
  address: '0x0987654321098765432109876543210987654321',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 1,
  logoURI: 'https://example.com/usdc.png',
};

describe('useSwapStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    const { result } = renderHook(() => useSwapStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSwapStore());

      expect(result.current.fromToken).toBeNull();
      expect(result.current.toToken).toBeNull();
      expect(result.current.fromAmount).toBe('');
      expect(result.current.toAmount).toBe('');
      expect(result.current.slippage).toBe(0.5);
      expect(result.current.deadline).toBe(20);
    });
  });

  describe('setFromToken', () => {
    it('should set fromToken', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromToken(mockToken1);
      });

      expect(result.current.fromToken).toEqual(mockToken1);
    });

    it('should set fromToken to null', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromToken(mockToken1);
      });

      act(() => {
        result.current.setFromToken(null);
      });

      expect(result.current.fromToken).toBeNull();
    });
  });

  describe('setToToken', () => {
    it('should set toToken', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setToToken(mockToken2);
      });

      expect(result.current.toToken).toEqual(mockToken2);
    });

    it('should set toToken to null', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setToToken(mockToken2);
      });

      act(() => {
        result.current.setToToken(null);
      });

      expect(result.current.toToken).toBeNull();
    });
  });

  describe('setFromAmount', () => {
    it('should set fromAmount', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromAmount('1.5');
      });

      expect(result.current.fromAmount).toBe('1.5');
    });

    it('should set fromAmount to empty string', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromAmount('1.5');
      });

      act(() => {
        result.current.setFromAmount('');
      });

      expect(result.current.fromAmount).toBe('');
    });
  });

  describe('setToAmount', () => {
    it('should set toAmount', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setToAmount('100');
      });

      expect(result.current.toAmount).toBe('100');
    });
  });

  describe('setSlippage', () => {
    it('should set slippage', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setSlippage(1.0);
      });

      expect(result.current.slippage).toBe(1.0);
    });

    it('should set custom slippage value', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setSlippage(2.5);
      });

      expect(result.current.slippage).toBe(2.5);
    });
  });

  describe('setDeadline', () => {
    it('should set deadline', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setDeadline(30);
      });

      expect(result.current.deadline).toBe(30);
    });
  });

  describe('swapTokens', () => {
    it('should swap fromToken and toToken', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromToken(mockToken1);
        result.current.setToToken(mockToken2);
      });

      act(() => {
        result.current.swapTokens();
      });

      expect(result.current.fromToken).toEqual(mockToken2);
      expect(result.current.toToken).toEqual(mockToken1);
    });

    it('should swap amounts as well', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromAmount('1.5');
        result.current.setToAmount('100');
      });

      act(() => {
        result.current.swapTokens();
      });

      expect(result.current.fromAmount).toBe('100');
      expect(result.current.toAmount).toBe('1.5');
    });

    it('should handle swap when tokens are null', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromToken(mockToken1);
      });

      act(() => {
        result.current.swapTokens();
      });

      expect(result.current.fromToken).toBeNull();
      expect(result.current.toToken).toEqual(mockToken1);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setFromToken(mockToken1);
        result.current.setToToken(mockToken2);
        result.current.setFromAmount('1.5');
        result.current.setToAmount('100');
        result.current.setSlippage(2.0);
        result.current.setDeadline(30);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.fromToken).toBeNull();
      expect(result.current.toToken).toBeNull();
      expect(result.current.fromAmount).toBe('');
      expect(result.current.toAmount).toBe('');
      expect(result.current.slippage).toBe(0.5);
      expect(result.current.deadline).toBe(20);
    });
  });

  describe('persistence', () => {
    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useSwapStore());

      act(() => {
        result.current.setSlippage(2.0);
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});

