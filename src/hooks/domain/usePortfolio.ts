/**
 * Portfolio data fetching hook
 * @module hooks/domain/usePortfolio
 */

import { useState, useEffect } from 'react';
import { getMultiChainBalances } from '@/services/portfolio/balance.service';
import type { PortfolioBalance } from '@/types/portfolio/balance';
import type { ChainId } from '@/types/blockchain';

export function usePortfolio(address?: string, chainIds?: ChainId[]) {
  const [portfolio, setPortfolio] = useState<PortfolioBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !chainIds || chainIds.length === 0) {
      setPortfolio(null);
      return;
    }

    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getMultiChainBalances(address, chainIds);
        setPortfolio(result);
      } catch (err) {
        setError(err as Error);
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [address, chainIds?.join(',')]);

  const refetch = async () => {
    if (!address || !chainIds) return;

    setLoading(true);
    try {
      const result = await getMultiChainBalances(address, chainIds);
      setPortfolio(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { portfolio, loading, error, refetch };
}

