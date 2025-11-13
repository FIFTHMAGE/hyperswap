/**
 * Hook for WebSocket connections
 */

import { useEffect, useState, useCallback } from 'react';
import { wsClient, WSEventType } from '@/lib/realtime/websocket-client';

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    wsClient
      .connect()
      .then(() => setConnected(true))
      .catch((err) => setError(err));

    return () => {
      wsClient.disconnect();
    };
  }, []);

  const subscribe = useCallback(
    (type: WSEventType, callback: (data: any) => void) => {
      return wsClient.subscribe(type, callback);
    },
    []
  );

  const send = useCallback((type: WSEventType, data: any) => {
    wsClient.send(type, data);
  }, []);

  return { connected, error, subscribe, send };
}

