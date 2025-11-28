/**
 * Portfolio store tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePortfolioStore } from '../portfolio.store';

import type { TokenBalance } from '@/types/domain.types';

const mockBalances: TokenBalance[] = [
  {
    token: {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://example.com/eth.png',
    },
    balance: '1.5',
    usdValue: 3000,
  },
  {
    token: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://example.com/usdc.png',
    },
    balance: '1000',
    usdValue: 1000,
  },
  {
    token: {
      address: '0x6B175474E89094C44Da98b954EesdfsdCDC831e',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://example.com/dai.png',
    },
    balance: '500',
    usdValue: 500,
  },
];

describe('usePortfolioStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => usePortfolioStore());
    act(() => {
      result.current.setBalances([]);
      result.current.setTotalValue(0);
      result.current.setIsLoading(false);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePortfolioStore());

      expect(result.current.balances).toEqual([]);
      expect(result.current.totalValue).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.lastUpdated).toBeNull();
    });
  });

  describe('setBalances', () => {
    it('should set balances', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setBalances(mockBalances);
      });

      expect(result.current.balances).toEqual(mockBalances);
    });

    it('should update lastUpdated when setting balances', () => {
      const { result } = renderHook(() => usePortfolioStore());
      const beforeUpdate = Date.now();

      act(() => {
        result.current.setBalances(mockBalances);
      });

      expect(result.current.lastUpdated).toBeGreaterThanOrEqual(beforeUpdate);
      expect(result.current.lastUpdated).toBeLessThanOrEqual(Date.now());
    });

    it('should replace existing balances', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setBalances(mockBalances);
      });

      const newBalances = [mockBalances[0]];

      act(() => {
        result.current.setBalances(newBalances);
      });

      expect(result.current.balances).toEqual(newBalances);
      expect(result.current.balances).toHaveLength(1);
    });

    it('should set empty balances', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setBalances(mockBalances);
      });

      act(() => {
        result.current.setBalances([]);
      });

      expect(result.current.balances).toEqual([]);
    });
  });

  describe('setTotalValue', () => {
    it('should set total value', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setTotalValue(4500);
      });

      expect(result.current.totalValue).toBe(4500);
    });

    it('should handle zero value', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setTotalValue(1000);
      });

      act(() => {
        result.current.setTotalValue(0);
      });

      expect(result.current.totalValue).toBe(0);
    });

    it('should handle large values', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setTotalValue(1000000000);
      });

      expect(result.current.totalValue).toBe(1000000000);
    });

    it('should handle decimal values', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setTotalValue(1234.56);
      });

      expect(result.current.totalValue).toBe(1234.56);
    });
  });

  describe('setIsLoading', () => {
    it('should set loading state to true', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setIsLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setIsLoading(true);
      });

      act(() => {
        result.current.setIsLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('updateBalance', () => {
    it('should update balance for existing token', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setBalances(mockBalances);
      });

      act(() => {
        result.current.updateBalance(
          '0x0000000000000000000000000000000000000000',
          '2.5'
        );
      });

      const updatedBalance = result.current.balances.find(
        (b) => b.token.address === '0x0000000000000000000000000000000000000000'
      );

      expect(updatedBalance?.balance).toBe('2.5');
    });

    it('should not modify other balances', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setBalances(mockBalances);
      });

      act(() => {
        result.current.updateBalance(
          '0x0000000000000000000000000000000000000000',
          '2.5'
        );
      });

      const usdcBalance = result.current.balances.find(
        (b) => b.token.symbol === 'USDC'
      );

      expect(usdcBalance?.balance).toBe('1000');
    });

    it('should not update non-existent token', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.setBalances(mockBalances);
      });

      act(() => {
        result.current.updateBalance(
          '0x1111111111111111111111111111111111111111',
          '100'
        );
      });

      expect(result.current.balances).toHaveLength(3);
    });
  });

  describe('refresh', () => {
    it('should set loading state to true', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.refresh();
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('full portfolio flow', () => {
    it('should handle loading portfolio data', () => {
      const { result } = renderHook(() => usePortfolioStore());

      // Start loading
      act(() => {
        result.current.setIsLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      // Set data
      act(() => {
        result.current.setBalances(mockBalances);
        result.current.setTotalValue(4500);
        result.current.setIsLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.balances).toHaveLength(3);
      expect(result.current.totalValue).toBe(4500);
      expect(result.current.lastUpdated).not.toBeNull();
    });

    it('should handle refresh flow', async () => {
      const { result } = renderHook(() => usePortfolioStore());

      // Initial data
      act(() => {
        result.current.setBalances(mockBalances);
        result.current.setTotalValue(4500);
      });

      // Trigger refresh
      act(() => {
        result.current.refresh();
      });

      expect(result.current.isLoading).toBe(true);

      // Simulate new data arrival
      const updatedBalances = mockBalances.map((b) => ({
        ...b,
        balance: String(Number(b.balance) * 1.1),
      }));

      act(() => {
        result.current.setBalances(updatedBalances);
        result.current.setTotalValue(4950);
        result.current.setIsLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.totalValue).toBe(4950);
    });
  });
});

