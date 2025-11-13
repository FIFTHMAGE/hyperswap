/**
 * Hook for fetching and managing token prices
 */

import { useState, useEffect } from 'react';

export function useTokenPrices(tokenAddresses: string[], chainId: number = 1) {
  const [prices, setPrices] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [tokenAddresses.join(','), chainId]);

  const fetchPrices = async () => {
    try {
      // Mock price fetching - would use CoinGecko/CoinMarketCap API
      const mockPrices = new Map<string, number>();
      tokenAddresses.forEach((address) => {
        mockPrices.set(address, 100 + Math.random() * 900);
      });
      setPrices(mockPrices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return { prices, loading, refetch: fetchPrices };
}

