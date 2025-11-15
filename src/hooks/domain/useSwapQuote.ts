/**
 * useSwapQuote hook - Get swap quote
 * @module hooks/domain
 */

import { useState, useEffect } from 'react';

import type { SwapQuote } from '@/types/domain.types';

interface UseSwapQuoteParams {
  fromToken: string | null;
  toToken: string | null;
  amount: string;
  chainId: number | null;
}

export function useSwapQuote({ fromToken, toToken, amount, chainId }: UseSwapQuoteParams) {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fromToken || !toToken || !amount || !chainId || parseFloat(amount) === 0) {
      setQuote(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchQuote = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock quote
        const mockQuote: SwapQuote = {
          fromToken,
          toToken,
          fromAmount: amount,
          toAmount: (parseFloat(amount) * 0.95).toString(),
          priceImpact: 0.5,
          slippage: 0.5,
          estimatedGas: '150000',
          route: [],
          timestamp: Date.now(),
        };

        setQuote(mockQuote);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch quote'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [fromToken, toToken, amount, chainId]);

  return { quote, isLoading, error };
}
