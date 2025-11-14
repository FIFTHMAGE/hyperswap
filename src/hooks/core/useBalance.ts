/**
 * Balance fetching hook
 * @module hooks/core/useBalance
 */

import { useState, useEffect } from 'react';
import { useBalance as useWagmiBalance } from 'wagmi';
import type { ChainId } from '@/types/blockchain';

export function useBalance(address?: string, chainId?: ChainId) {
  const { data, isLoading, isError, refetch } = useWagmiBalance({
    address: address as any,
    chainId,
  });

  const [balance, setBalance] = useState<{
    value: bigint;
    decimals: number;
    symbol: string;
    formatted: string;
  } | null>(null);

  useEffect(() => {
    if (data) {
      setBalance({
        value: data.value,
        decimals: data.decimals,
        symbol: data.symbol,
        formatted: data.formatted,
      });
    }
  }, [data]);

  return {
    balance,
    isLoading,
    isError,
    refetch,
  };
}

