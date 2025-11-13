/**
 * Hook for fetching and managing wrapped data
 */

import { useState, useEffect } from 'react';
import { wrappedAnalyticsService } from '@/lib/api/wrapped-analytics';

export function useWrappedData(address: string, year: number = 2024) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [address, year]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const wrappedData = await wrappedAnalyticsService.generateWrappedData(address, year);
      setData(wrappedData);
    } catch (err) {
      setError('Failed to load wrapped data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: loadData };
}

