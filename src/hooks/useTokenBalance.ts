/**
 * useTokenBalance - Hook for fetching and tracking token balances
 * @module hooks
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
  valueUSD?: number;
  price?: number;
  change24h?: number;
}

export interface BalanceOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  includePrice?: boolean;
  onUpdate?: (balance: TokenBalance) => void;
  onError?: (error: Error) => void;
}

const DEFAULT_OPTIONS: Required<BalanceOptions> = {
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  includePrice: true,
  onUpdate: () => {},
  onError: () => {},
};

export function useTokenBalance(
  tokenAddress: string,
  walletAddress: string | null,
  options?: BalanceOptions
) {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch token balance
   */
  const fetchBalance = useCallback(async () => {
    if (!walletAddress) {
      setBalance(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const tokenBalance = await getTokenBalance(
        tokenAddress,
        walletAddress,
        opts.includePrice,
        abortControllerRef.current.signal
      );

      setBalance(tokenBalance);
      opts.onUpdate(tokenBalance);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled
      }

      const error = err instanceof Error ? err : new Error('Failed to fetch balance');
      setError(error);
      opts.onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [tokenAddress, walletAddress, opts]);

  /**
   * Refresh balance
   */
  const refresh = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  /**
   * Start auto-refresh
   */
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      fetchBalance();
    }, opts.refreshInterval);
  }, [fetchBalance, opts.refreshInterval]);

  /**
   * Stop auto-refresh
   */
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchBalance();

    if (opts.autoRefresh && walletAddress) {
      startAutoRefresh();
    }

    return () => {
      stopAutoRefresh();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBalance, opts.autoRefresh, walletAddress, startAutoRefresh, stopAutoRefresh]);

  return {
    balance,
    isLoading,
    error,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
  };
}

/**
 * Hook for multiple token balances
 */
export function useTokenBalances(
  tokenAddresses: string[],
  walletAddress: string | null,
  options?: BalanceOptions
) {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  const [balances, setBalances] = useState<Map<string, TokenBalance>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch all balances
   */
  const fetchBalances = useCallback(async () => {
    if (!walletAddress || tokenAddresses.length === 0) {
      setBalances(new Map());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const balancePromises = tokenAddresses.map((address) =>
        getTokenBalance(address, walletAddress, opts.includePrice)
      );

      const results = await Promise.allSettled(balancePromises);
      const newBalances = new Map<string, TokenBalance>();

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          newBalances.set(tokenAddresses[index], result.value);
        }
      });

      setBalances(newBalances);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balances');
      setError(error);
      opts.onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [tokenAddresses, walletAddress, opts]);

  /**
   * Refresh all balances
   */
  const refresh = useCallback(() => {
    fetchBalances();
  }, [fetchBalances]);

  /**
   * Get balance for specific token
   */
  const getBalance = useCallback(
    (tokenAddress: string): TokenBalance | null => {
      return balances.get(tokenAddress) || null;
    },
    [balances]
  );

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchBalances();

    if (opts.autoRefresh && walletAddress) {
      intervalRef.current = setInterval(() => {
        fetchBalances();
      }, opts.refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchBalances, opts.autoRefresh, walletAddress, opts.refreshInterval]);

  return {
    balances: Array.from(balances.values()),
    balancesMap: balances,
    isLoading,
    error,
    refresh,
    getBalance,
  };
}

/**
 * Helper function to fetch token balance
 */
async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  includePrice: boolean = true,
  signal?: AbortSignal
): Promise<TokenBalance> {
  // Mock implementation - would integrate with blockchain provider
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Check if request was cancelled
  if (signal?.aborted) {
    throw new Error('Request aborted');
  }

  // Mock data
  const balance = (Math.random() * 1000).toFixed(6);
  const decimals = 18;
  const price = includePrice ? 2000 + Math.random() * 100 : undefined;
  const change24h = includePrice ? (Math.random() - 0.5) * 10 : undefined;

  return {
    address: tokenAddress,
    symbol: getTokenSymbol(tokenAddress),
    name: getTokenName(tokenAddress),
    balance,
    decimals,
    formattedBalance: formatBalance(balance, decimals),
    price,
    valueUSD: price ? parseFloat(balance) * price : undefined,
    change24h,
  };
}

/**
 * Format balance for display
 */
function formatBalance(balance: string, _decimals: number = 18): string {
  const num = parseFloat(balance);

  if (num === 0) return '0';

  if (num < 0.000001) {
    return num.toExponential(2);
  }

  if (num < 1) {
    return num.toFixed(6);
  }

  if (num < 1000) {
    return num.toFixed(4);
  }

  if (num < 1000000) {
    return num.toFixed(2);
  }

  return (num / 1000000).toFixed(2) + 'M';
}

/**
 * Get token symbol (mock)
 */
function getTokenSymbol(address: string): string {
  const symbols: Record<string, string> = {
    '0x0': 'ETH',
    native: 'ETH',
  };
  return symbols[address.toLowerCase()] || 'TOKEN';
}

/**
 * Get token name (mock)
 */
function getTokenName(address: string): string {
  const names: Record<string, string> = {
    '0x0': 'Ethereum',
    native: 'Ethereum',
  };
  return names[address.toLowerCase()] || 'Unknown Token';
}

/**
 * Parse balance from wei
 */
export function parseBalanceFromWei(balance: string, decimals: number = 18): string {
  const num = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const whole = num / divisor;
  const fraction = num % divisor;

  if (fraction === BigInt(0)) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr}`.replace(/\.?0+$/, '');
}

/**
 * Format balance to wei
 */
export function formatBalanceToWei(balance: string, decimals: number = 18): string {
  const [whole, fraction = ''] = balance.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').substring(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction)).toString();
}
