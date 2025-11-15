/**
 * usePortfolio hook - Portfolio tracking
 * @module hooks/features
 */

import { useEffect } from 'react';

import { usePortfolioStore } from '@/store/portfolio.store';

export function usePortfolio(address: string | null, chainId: number | null) {
  const { balances, totalValue, isLoading, lastUpdated, setBalances, setTotalValue, setIsLoading } =
    usePortfolioStore();

  useEffect(() => {
    if (!address || !chainId) return;

    const fetchPortfolio = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockBalances = [];
        setBalances(mockBalances);
        setTotalValue(Math.random() * 10000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [address, chainId, setBalances, setTotalValue, setIsLoading]);

  return {
    balances,
    totalValue,
    isLoading,
    lastUpdated,
  };
}
