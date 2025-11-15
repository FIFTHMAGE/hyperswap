/**
 * Hook for real-time price updates
 */

import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export function useRealTimePrice(symbol: string) {
  const [price, setPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      setLoading(true);
      
      const unsubscribe = subscribe('price_update', (data) => {
        if (data.symbol === symbol) {
          setPrice(data.price);
          setChange24h(data.change24h);
          setLoading(false);
        }
      });

      return unsubscribe;
    }
  }, [connected, subscribe, symbol]);

  return { price, change24h, loading, connected };
}

