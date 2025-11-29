/**
 * useSwapQuote Hook
 * Fetch and manage swap quotes
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

export interface SwapRoute {
  path: string[];
  pools: string[];
  fees: number[];
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  priceImpact: number;
  route: SwapRoute;
  gasEstimate: string;
  fee: string;
  exchangeRate: number;
  validUntil: Date;
}

export interface UseSwapQuoteOptions {
  /** Slippage tolerance in percentage */
  slippage?: number;
  /** Auto-refresh interval in ms */
  refreshInterval?: number;
  /** Debounce delay for amount changes */
  debounceMs?: number;
}

export interface UseSwapQuoteReturn {
  quote: SwapQuote | null;
  isLoading: boolean;
  error: Error | null;
  fetchQuote: (fromToken: Token, toToken: Token, amount: string) => Promise<void>;
  refresh: () => Promise<void>;
  isStale: boolean;
}

const DEFAULT_OPTIONS: UseSwapQuoteOptions = {
  slippage: 0.5,
  refreshInterval: 30000,
  debounceMs: 500,
};

export function useSwapQuote(options: UseSwapQuoteOptions = {}): UseSwapQuoteReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const lastParamsRef = useRef<{ from: Token; to: Token; amount: string } | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuoteInternal = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: string
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsStale(false);

    try {
      // In production, call actual DEX aggregator API
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));

      const fromAmount = parseFloat(amount);
      const exchangeRate = 0.98 + Math.random() * 0.04; // Mock rate
      const toAmount = fromAmount * exchangeRate;
      const priceImpact = Math.random() * 0.5;

      const swapQuote: SwapQuote = {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: toAmount.toFixed(6),
        toAmountMin: (toAmount * (1 - (opts.slippage || 0.5) / 100)).toFixed(6),
        priceImpact,
        route: {
          path: [fromToken.address, toToken.address],
          pools: [`pool_${fromToken.symbol}_${toToken.symbol}`],
          fees: [3000],
        },
        gasEstimate: (Math.random() * 0.01 + 0.001).toFixed(6),
        fee: (fromAmount * 0.003).toFixed(6),
        exchangeRate,
        validUntil: new Date(Date.now() + 30000),
      };

      setQuote(swapQuote);
      lastParamsRef.current = { from: fromToken, to: toToken, amount };

      // Start staleness timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      refreshTimerRef.current = setTimeout(() => {
        setIsStale(true);
      }, opts.refreshInterval);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch quote'));
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, [opts.slippage, opts.refreshInterval]);

  const fetchQuote = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: string
  ) => {
    // Debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchQuoteInternal(fromToken, toToken, amount);
    }, opts.debounceMs);
  }, [fetchQuoteInternal, opts.debounceMs]);

  const refresh = useCallback(async () => {
    if (lastParamsRef.current) {
      const { from, to, amount } = lastParamsRef.current;
      await fetchQuoteInternal(from, to, amount);
    }
  }, [fetchQuoteInternal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  return {
    quote,
    isLoading,
    error,
    fetchQuote,
    refresh,
    isStale,
  };
}

export default useSwapQuote;

