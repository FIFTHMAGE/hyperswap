/**
 * Hook for live balance updates
 */

import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export function useLiveBalance(address?: string) {
  const [balances, setBalances] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected && address) {
      setLoading(true);

      const unsubscribe = subscribe('balance_update', (data) => {
        if (data.address === address) {
          setBalances((prev) => {
            const updated = new Map(prev);
            updated.set(data.token, data.balance);
            return updated;
          });
          setLoading(false);
        }
      });

      return unsubscribe;
    }
  }, [connected, subscribe, address]);

  return { balances, loading, connected };
}

