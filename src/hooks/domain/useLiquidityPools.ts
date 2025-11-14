/**
 * Liquidity pools fetching hook
 * @module hooks/domain/useLiquidityPools
 */

import { useState, useEffect } from 'react';
import { discoverPools } from '@/services/liquidity/pool-discovery.service';
import type { LiquidityPool } from '@/types/liquidity/pool';
import type { ChainId } from '@/types/blockchain';

export function useLiquidityPools(params: {
  chainId?: ChainId;
  tokenAddress?: string;
  minLiquidity?: number;
  sortBy?: 'tvl' | 'volume' | 'apy';
}) {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!params.chainId) {
      setPools([]);
      return;
    }

    const fetchPools = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await discoverPools(params);
        setPools(result);
      } catch (err) {
        setError(err as Error);
        setPools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [params.chainId, params.tokenAddress, params.minLiquidity, params.sortBy]);

  return { pools, loading, error };
}

