/**
 * useTokenBalance hook tests
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock dependencies
vi.mock('@/services/api/tokens', () => ({
  getTokenBalance: vi.fn(),
}));

vi.mock('@/hooks/core/useWallet', () => ({
  useWallet: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
}));

import { useTokenBalance } from '../domain/useTokenBalance';
import { getTokenBalance } from '@/services/api/tokens';

const mockGetTokenBalance = vi.mocked(getTokenBalance);

describe('useTokenBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should start with loading state', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000000000000000',
        formatted: '1.0',
        decimals: 18,
      });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.balance).toBeNull();

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('should fetch balance on mount', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000000000000000',
        formatted: '1.0',
        decimals: 18,
      });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => {
        expect(mockGetTokenBalance).toHaveBeenCalled();
        expect(result.current.balance).toBe('1000000000000000000');
        expect(result.current.formatted).toBe('1.0');
      });
    });
  });

  describe('balance data', () => {
    it('should return formatted balance', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '2500000000000000000',
        formatted: '2.5',
        decimals: 18,
      });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => {
        expect(result.current.formatted).toBe('2.5');
      });
    });

    it('should return decimals', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000',
        formatted: '1.0',
        decimals: 6,
      });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => {
        expect(result.current.decimals).toBe(6);
      });
    });

    it('should handle zero balance', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '0',
        formatted: '0.0',
        decimals: 18,
      });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => {
        expect(result.current.balance).toBe('0');
        expect(result.current.formatted).toBe('0.0');
      });
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors', async () => {
      mockGetTokenBalance.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.isError).toBe(true);
      });
    });

    it('should clear error on successful refetch', async () => {
      mockGetTokenBalance
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          balance: '1000000000000000000',
          formatted: '1.0',
          decimals: 18,
        });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(false);
        expect(result.current.balance).toBe('1000000000000000000');
      });
    });
  });

  describe('refetch', () => {
    it('should refetch balance when called', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000000000000000',
        formatted: '1.0',
        decimals: 18,
      });

      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress')
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      mockGetTokenBalance.mockResolvedValue({
        balance: '2000000000000000000',
        formatted: '2.0',
        decimals: 18,
      });

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.balance).toBe('2000000000000000000');
      });
    });
  });

  describe('token address changes', () => {
    it('should refetch when token address changes', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000000000000000',
        formatted: '1.0',
        decimals: 18,
      });

      const { result, rerender } = renderHook(
        ({ tokenAddress }) => useTokenBalance(tokenAddress),
        { initialProps: { tokenAddress: '0xToken1' } }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      mockGetTokenBalance.mockResolvedValue({
        balance: '5000000000000000000',
        formatted: '5.0',
        decimals: 18,
      });

      rerender({ tokenAddress: '0xToken2' });

      await waitFor(() => {
        expect(mockGetTokenBalance).toHaveBeenCalledTimes(2);
        expect(result.current.balance).toBe('5000000000000000000');
      });
    });
  });

  describe('disabled state', () => {
    it('should not fetch when disabled', async () => {
      const { result } = renderHook(() =>
        useTokenBalance('0xTokenAddress', { enabled: false })
      );

      expect(mockGetTokenBalance).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    it('should fetch when enabled changes to true', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000000000000000',
        formatted: '1.0',
        decimals: 18,
      });

      const { result, rerender } = renderHook(
        ({ enabled }) => useTokenBalance('0xTokenAddress', { enabled }),
        { initialProps: { enabled: false } }
      );

      expect(mockGetTokenBalance).not.toHaveBeenCalled();

      rerender({ enabled: true });

      await waitFor(() => {
        expect(mockGetTokenBalance).toHaveBeenCalled();
        expect(result.current.balance).toBe('1000000000000000000');
      });
    });
  });

  describe('polling', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should poll at specified interval', async () => {
      mockGetTokenBalance.mockResolvedValue({
        balance: '1000000000000000000',
        formatted: '1.0',
        decimals: 18,
      });

      renderHook(() =>
        useTokenBalance('0xTokenAddress', { pollInterval: 5000 })
      );

      // Initial fetch
      expect(mockGetTokenBalance).toHaveBeenCalledTimes(1);

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockGetTokenBalance).toHaveBeenCalledTimes(2);

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockGetTokenBalance).toHaveBeenCalledTimes(3);
    });
  });
});

