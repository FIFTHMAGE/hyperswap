/**
 * useLiquidity Hook
 * Fetch and manage liquidity pool data
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

export interface Pool {
  address: string;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  fee: number;
  protocol: string;
  tvlUSD: string;
  volume24hUSD: string;
  apy: number;
}

export interface UserLiquidity {
  pool: Pool;
  lpBalance: string;
  share: number;
  token0Amount: string;
  token1Amount: string;
  valueUSD: string;
  rewards?: {
    token: Token;
    amount: string;
    valueUSD: string;
  }[];
}

export interface UseLiquidityOptions {
  address: string | undefined;
  pools?: string[];
  refreshInterval?: number;
}

export interface UseLiquidityReturn {
  pools: Pool[];
  userLiquidity: UserLiquidity[];
  isLoading: boolean;
  error: Error | null;
  getPool: (poolAddress: string) => Pool | null;
  getUserLiquidity: (poolAddress: string) => UserLiquidity | null;
  refresh: () => Promise<void>;
  totalValueUSD: string;
}

export function useLiquidity(options: UseLiquidityOptions): UseLiquidityReturn {
  const { address, pools: poolAddresses, refreshInterval = 30000 } = options;
  
  const [pools, setPools] = useState<Pool[]>([]);
  const [userLiquidity, setUserLiquidity] = useState<UserLiquidity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call actual DEX APIs
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock pool data
      const mockPools: Pool[] = [
        {
          address: '0xpool1',
          token0: { address: '0xeth', symbol: 'ETH', decimals: 18 },
          token1: { address: '0xusdc', symbol: 'USDC', decimals: 6 },
          reserve0: '1000.123456',
          reserve1: '2350000.00',
          totalSupply: '4847.234567',
          fee: 3000,
          protocol: 'uniswap_v3',
          tvlUSD: '4700000',
          volume24hUSD: '1250000',
          apy: 24.5,
        },
        {
          address: '0xpool2',
          token0: { address: '0xwbtc', symbol: 'WBTC', decimals: 8 },
          token1: { address: '0xeth', symbol: 'ETH', decimals: 18 },
          reserve0: '50.12345678',
          reserve1: '925.654321',
          totalSupply: '215.789456',
          fee: 500,
          protocol: 'uniswap_v3',
          tvlUSD: '4350000',
          volume24hUSD: '890000',
          apy: 18.2,
        },
      ];

      setPools(mockPools);

      // Generate user liquidity if address provided
      if (address) {
        const mockUserLiquidity: UserLiquidity[] = mockPools.map(pool => ({
          pool,
          lpBalance: (Math.random() * 10).toFixed(6),
          share: Math.random() * 2,
          token0Amount: (Math.random() * 5).toFixed(6),
          token1Amount: (Math.random() * 10000).toFixed(2),
          valueUSD: (Math.random() * 50000).toFixed(2),
          rewards: Math.random() > 0.5 ? [
            {
              token: { address: '0xuni', symbol: 'UNI', decimals: 18 },
              amount: (Math.random() * 100).toFixed(4),
              valueUSD: (Math.random() * 500).toFixed(2),
            },
          ] : undefined,
        }));
        setUserLiquidity(mockUserLiquidity);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch liquidity data'));
    } finally {
      setIsLoading(false);
    }
  }, [address, poolAddresses]);

  const getPool = useCallback((poolAddress: string): Pool | null => {
    return pools.find(p => p.address.toLowerCase() === poolAddress.toLowerCase()) || null;
  }, [pools]);

  const getUserLiquidity = useCallback((poolAddress: string): UserLiquidity | null => {
    return userLiquidity.find(l => l.pool.address.toLowerCase() === poolAddress.toLowerCase()) || null;
  }, [userLiquidity]);

  const refresh = useCallback(async () => {
    await fetchPools();
  }, [fetchPools]);

  const totalValueUSD = useMemo(() => {
    return userLiquidity
      .reduce((sum, l) => sum + parseFloat(l.valueUSD), 0)
      .toFixed(2);
  }, [userLiquidity]);

  // Initial fetch
  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchPools, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPools, refreshInterval]);

  return {
    pools,
    userLiquidity,
    isLoading,
    error,
    getPool,
    getUserLiquidity,
    refresh,
    totalValueUSD,
  };
}

export default useLiquidity;

