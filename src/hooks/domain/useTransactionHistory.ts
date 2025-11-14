/**
 * Transaction history hook
 * @module hooks/domain/useTransactionHistory
 */

import { useState, useEffect } from 'react';
import { getMultiChainHistory } from '@/services/portfolio/transaction-history.service';
import type { PortfolioTransaction } from '@/types/portfolio/transaction';
import type { ChainId } from '@/types/blockchain';

export function useTransactionHistory(
  address?: string,
  chainIds?: ChainId[],
  pageSize: number = 10
) {
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !chainIds || chainIds.length === 0) {
      setTransactions([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getMultiChainHistory(address, chainIds, pageSize);
        setTransactions(result);
      } catch (err) {
        setError(err as Error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [address, chainIds?.join(','), pageSize]);

  return { transactions, loading, error };
}

