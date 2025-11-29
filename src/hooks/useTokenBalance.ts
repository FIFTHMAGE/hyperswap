/**
 * useTokenBalance Hook
 * Fetch and manage token balances for multiple tokens
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  balanceFormatted: string;
  balanceUSD?: string;
}

export interface UseTokenBalanceOptions {
  address: string | undefined;
  tokens: Token[];
  refreshInterval?: number;
  enabled?: boolean;
}

export interface UseTokenBalanceReturn {
  balances: Map<string, TokenBalance>;
  isLoading: boolean;
  error: Error | null;
  getBalance: (tokenAddress: string) => TokenBalance | null;
  hasBalance: (tokenAddress: string, amount: string) => boolean;
  refresh: () => Promise<void>;
}

const DEFAULT_REFRESH_INTERVAL = 15000; // 15 seconds

export function useTokenBalance(options: UseTokenBalanceOptions): UseTokenBalanceReturn {
  const { address, tokens, refreshInterval = DEFAULT_REFRESH_INTERVAL, enabled = true } = options;
  
  const [balances, setBalances] = useState<Map<string, TokenBalance>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address || !enabled || tokens.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // In production, use multicall to batch balance queries
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));

      const newBalances = new Map<string, TokenBalance>();

      for (const token of tokens) {
        // Generate mock balance
        const rawBalance = Math.random() * 100;
        const formatted = rawBalance.toFixed(6);
        const usdValue = (rawBalance * (Math.random() * 2000 + 100)).toFixed(2);

        newBalances.set(token.address.toLowerCase(), {
          token,
          balance: (rawBalance * Math.pow(10, token.decimals)).toString(),
          balanceFormatted: formatted,
          balanceUSD: usdValue,
        });
      }

      setBalances(newBalances);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch balances'));
    } finally {
      setIsLoading(false);
    }
  }, [address, tokens, enabled]);

  const getBalance = useCallback((tokenAddress: string): TokenBalance | null => {
    return balances.get(tokenAddress.toLowerCase()) || null;
  }, [balances]);

  const hasBalance = useCallback((tokenAddress: string, amount: string): boolean => {
    const balance = getBalance(tokenAddress);
    if (!balance) return false;
    
    const balanceNum = parseFloat(balance.balanceFormatted);
    const amountNum = parseFloat(amount);
    return balanceNum >= amountNum;
  }, [getBalance]);

  const refresh = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchBalances();
    }
  }, [fetchBalances, enabled]);

  // Auto-refresh
  useEffect(() => {
    if (enabled && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchBalances, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchBalances, refreshInterval, enabled]);

  // Clear balances when address changes
  useEffect(() => {
    if (!address) {
      setBalances(new Map());
    }
  }, [address]);

  return {
    balances,
    isLoading,
    error,
    getBalance,
    hasBalance,
    refresh,
  };
}

export default useTokenBalance;
