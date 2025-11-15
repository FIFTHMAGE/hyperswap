/**
 * Hook for tracking real-time performance metrics
 */

import { useState, useEffect } from 'react';

interface Metrics {
  messagesReceived: number;
  messagesSent: number;
  averageLatency: number;
  connectionUptime: number;
  reconnections: number;
}

export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    messagesReceived: 0,
    messagesSent: 0,
    averageLatency: 0,
    connectionUptime: 0,
    reconnections: 0,
  });

  useEffect(() => {
    // Track metrics
    const startTime = Date.now();

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        connectionUptime: Date.now() - startTime,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const recordMessage = (type: 'sent' | 'received', latency?: number) => {
    setMetrics((prev) => ({
      ...prev,
      messagesReceived: type === 'received' ? prev.messagesReceived + 1 : prev.messagesReceived,
      messagesSent: type === 'sent' ? prev.messagesSent + 1 : prev.messagesSent,
      averageLatency: latency
        ? (prev.averageLatency + latency) / 2
        : prev.averageLatency,
    }));
  };

  const recordReconnection = () => {
    setMetrics((prev) => ({
      ...prev,
      reconnections: prev.reconnections + 1,
    }));
  };

  return { metrics, recordMessage, recordReconnection };
}

