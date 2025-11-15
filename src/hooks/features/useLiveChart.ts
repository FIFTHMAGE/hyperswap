/**
 * Hook for live chart data updates
 */

import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { PriceData } from '@/lib/types/chart';

export function useLiveChart(symbol: string, maxDataPoints: number = 100) {
  const [data, setData] = useState<PriceData[]>([]);
  const { connected, subscribe } = useWebSocket();
  const dataRef = useRef<PriceData[]>([]);

  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe('price_update', (update) => {
        if (update.symbol === symbol) {
          const newPoint: PriceData = {
            timestamp: update.timestamp,
            open: update.open || update.price,
            high: update.high || update.price,
            low: update.low || update.price,
            close: update.price,
            volume: update.volume || 0,
          };

          dataRef.current = [...dataRef.current, newPoint].slice(-maxDataPoints);
          setData([...dataRef.current]);
        }
      });

      return unsubscribe;
    }
  }, [connected, subscribe, symbol, maxDataPoints]);

  const clearData = () => {
    dataRef.current = [];
    setData([]);
  };

  return { data, clearData, connected };
}

