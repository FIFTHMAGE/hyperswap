/**
 * Year wrapped statistics hook
 * @module hooks/domain/useWrappedStats
 */

import { useState, useEffect } from 'react';
import { aggregateWrappedData } from '@/services/wrapped/data-aggregator.service';
import type { WrappedStats } from '@/types/wrapped/stats';

export function useWrappedStats(address?: string, year?: number) {
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await aggregateWrappedData(address, year);
        setStats(result);
      } catch (err) {
        setError(err as Error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [address, year]);

  return { stats, loading, error };
}

