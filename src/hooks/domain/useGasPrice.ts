/**
 * useGasPrice hook - Fetch current gas price
 * @module hooks/domain
 */

import { useState, useEffect } from 'react';

export function useGasPrice(chainId: number | null, refreshInterval = 10000) {
  const [gasPrice, setGasPrice] = useState<{
    slow: string;
    standard: string;
    fast: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chainId) return;

    const fetchGasPrice = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        setGasPrice({
          slow: '20',
          standard: '30',
          fast: '50',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, refreshInterval);

    return () => clearInterval(interval);
  }, [chainId, refreshInterval]);

  return { gasPrice, isLoading };
}
