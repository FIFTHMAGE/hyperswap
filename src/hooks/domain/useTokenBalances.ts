/**
 * Token balances fetching hook
 * @module hooks/domain/useTokenBalances
 */

import { useState, useEffect } from 'react';
import { getTokenBalances } from '@/services/api/covalent.service';
import type { TokenWithBalance } from '@/types/token';
import type { ChainId } from '@/types/blockchain';

export function useTokenBalances(chainId?: ChainId, address?: string) {
  const [balances, setBalances] = useState<TokenWithBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chainId || !address) {
      setBalances([]);
      return;
    }

    const fetchBalances = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getTokenBalances(chainId, address);
        setBalances(result);
      } catch (err) {
        setError(err as Error);
        setBalances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [chainId, address]);

  const refetch = async () => {
    if (!chainId || !address) return;
    
    setLoading(true);
    try {
      const result = await getTokenBalances(chainId, address);
      setBalances(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { balances, loading, error, refetch };
}

