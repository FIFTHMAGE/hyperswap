import { useState, useEffect } from 'react';
import { WalletWrappedStats } from '../types/wrapped';

export function useWrappedData(address: string | undefined) {
  const [data, setData] = useState<WalletWrappedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch(`/api/wrapped?address=${address}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address]);

  return { data, loading, error };
}

