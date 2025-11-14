/**
 * Token search hook
 * @module hooks/domain/useTokenSearch
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../core/useDebounce';
import { searchTokens } from '@/services/token/metadata.service';
import type { ERC20Token } from '@/types/token';
import type { ChainId } from '@/types/blockchain';

export function useTokenSearch(chainId?: ChainId, query?: string) {
  const [results, setResults] = useState<ERC20Token[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query || '', 300);

  useEffect(() => {
    if (!chainId || !debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);

      try {
        const tokens = await searchTokens(chainId, debouncedQuery);
        setResults(tokens);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [chainId, debouncedQuery]);

  return { results, loading };
}

