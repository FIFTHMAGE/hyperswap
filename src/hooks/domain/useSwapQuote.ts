/**
 * Swap quote fetching hook
 * @module hooks/domain/useSwapQuote
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../core/useDebounce';
import { getSwapQuote } from '@/services/swap/quote.service';
import type { SwapQuote } from '@/types/swap';
import type { ChainId } from '@/types/blockchain';

export function useSwapQuote(params: {
  chainId?: ChainId;
  fromToken?: string;
  toToken?: string;
  amount?: string;
  slippage?: number;
  enabled?: boolean;
}) {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedAmount = useDebounce(params.amount, 500);

  useEffect(() => {
    if (!params.enabled || !params.chainId || !params.fromToken || !params.toToken || !debouncedAmount) {
      setQuote(null);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getSwapQuote({
          chainId: params.chainId!,
          fromToken: params.fromToken!,
          toToken: params.toToken!,
          amount: debouncedAmount,
          slippage: params.slippage || 0.005,
        });

        setQuote(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [params.chainId, params.fromToken, params.toToken, debouncedAmount, params.slippage, params.enabled]);

  return { quote, loading, error };
}

