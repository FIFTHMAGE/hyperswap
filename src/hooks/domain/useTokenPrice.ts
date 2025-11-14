/**
 * Token price fetching hook
 * @module hooks/domain/useTokenPrice
 */

import { useState, useEffect } from 'react';
import { useInterval } from '../core/useInterval';
import { getTokenPrice } from '@/services/api/token-price.service';
import type { ChainId } from '@/types/blockchain';

export function useTokenPrice(
  chainId?: ChainId,
  tokenAddress?: string,
  refreshInterval: number | null = 30000 // 30 seconds
) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrice = async () => {
    if (!chainId || !tokenAddress) {
      setPrice(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getTokenPrice(chainId, tokenAddress);
      setPrice(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, [chainId, tokenAddress]);

  useInterval(fetchPrice, refreshInterval);

  return { price, loading, error, refetch: fetchPrice };
}

