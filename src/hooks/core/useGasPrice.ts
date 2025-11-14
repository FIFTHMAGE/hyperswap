/**
 * Gas price fetching hook
 * @module hooks/core/useGasPrice
 */

import { useState, useEffect } from 'react';
import { useGasPrice as useWagmiGasPrice } from 'wagmi';
import { formatUnits } from 'viem';

export function useGasPrice() {
  const { data, isLoading, isError, refetch } = useWagmiGasPrice();
  
  const [gasPrice, setGasPrice] = useState<{
    value: bigint;
    formatted: string;
    gwei: string;
  } | null>(null);

  useEffect(() => {
    if (data) {
      setGasPrice({
        value: data,
        formatted: formatUnits(data, 18),
        gwei: formatUnits(data, 9),
      });
    }
  }, [data]);

  return {
    gasPrice,
    isLoading,
    isError,
    refetch,
  };
}

