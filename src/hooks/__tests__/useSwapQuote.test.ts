/**
 * useSwapQuote hook tests
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/services/api/swap-aggregator', () => ({
  getSwapQuote: vi.fn(),
}));

import { useSwapQuote } from '../domain/useSwapQuote';
import { getSwapQuote } from '@/services/api/swap-aggregator';

const mockGetSwapQuote = vi.mocked(getSwapQuote);

describe('useSwapQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultParams = {
    fromToken: '0xFromToken',
    toToken: '0xToToken',
    amount: '1000000000000000000',
    slippage: 0.5,
  };

  describe('initialization', () => {
    it('should not fetch quote without required params', () => {
      renderHook(() => useSwapQuote({}));

      expect(mockGetSwapQuote).not.toHaveBeenCalled();
    });

    it('should fetch quote when all params are provided', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: [],
        gas: '21000',
      });

      renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500); // Debounce
      });

      expect(mockGetSwapQuote).toHaveBeenCalled();
    });
  });

  describe('quote data', () => {
    it('should return estimated output', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: ['DEX1', 'DEX2'],
        gas: '150000',
      });

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.quote?.estimatedOutput).toBe('2000000000000000000');
      });
    });

    it('should return price impact', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 2.5,
        route: [],
        gas: '21000',
      });

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.quote?.priceImpact).toBe(2.5);
      });
    });

    it('should return swap route', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: ['Uniswap', 'SushiSwap'],
        gas: '21000',
      });

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.quote?.route).toEqual(['Uniswap', 'SushiSwap']);
      });
    });
  });

  describe('debouncing', () => {
    it('should debounce quote requests', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: [],
        gas: '21000',
      });

      const { rerender } = renderHook(
        ({ amount }) => useSwapQuote({ ...defaultParams, amount }),
        { initialProps: { amount: '1000000000000000000' } }
      );

      rerender({ amount: '1100000000000000000' });
      rerender({ amount: '1200000000000000000' });
      rerender({ amount: '1300000000000000000' });

      expect(mockGetSwapQuote).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(mockGetSwapQuote).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading state', () => {
    it('should set loading during fetch', async () => {
      let resolveQuote: (value: unknown) => void;
      mockGetSwapQuote.mockReturnValue(
        new Promise((resolve) => {
          resolveQuote = resolve;
        })
      );

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveQuote!({
          estimatedOutput: '2000000000000000000',
          priceImpact: 0.1,
          route: [],
          gas: '21000',
        });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors', async () => {
      mockGetSwapQuote.mockRejectedValue(new Error('Insufficient liquidity'));

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.isError).toBe(true);
      });
    });

    it('should clear error on successful fetch', async () => {
      mockGetSwapQuote
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValueOnce({
          estimatedOutput: '2000000000000000000',
          priceImpact: 0.1,
          route: [],
          gas: '21000',
        });

      const { result, rerender } = renderHook(
        ({ amount }) => useSwapQuote({ ...defaultParams, amount }),
        { initialProps: { amount: '1000000000000000000' } }
      );

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      rerender({ amount: '2000000000000000000' });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(false);
      });
    });
  });

  describe('refetch', () => {
    it('should refetch quote when called', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: [],
        gas: '21000',
      });

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => expect(result.current.quote).toBeDefined());

      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2100000000000000000',
        priceImpact: 0.15,
        route: [],
        gas: '21000',
      });

      await act(async () => {
        result.current.refetch();
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.quote?.estimatedOutput).toBe('2100000000000000000');
      });
    });
  });

  describe('high price impact warning', () => {
    it('should flag high price impact', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 5.0, // High impact
        route: [],
        gas: '21000',
      });

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.hasHighPriceImpact).toBe(true);
      });
    });

    it('should not flag low price impact', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: [],
        gas: '21000',
      });

      const { result } = renderHook(() => useSwapQuote(defaultParams));

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.hasHighPriceImpact).toBe(false);
      });
    });
  });

  describe('minimum output', () => {
    it('should calculate minimum output with slippage', async () => {
      mockGetSwapQuote.mockResolvedValue({
        estimatedOutput: '2000000000000000000',
        priceImpact: 0.1,
        route: [],
        gas: '21000',
      });

      const { result } = renderHook(() =>
        useSwapQuote({ ...defaultParams, slippage: 1 })
      );

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        // With 1% slippage, min output = 2000000000000000000 * 0.99
        expect(result.current.minimumOutput).toBe('1980000000000000000');
      });
    });
  });
});

