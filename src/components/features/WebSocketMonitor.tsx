/**
 * WebSocket Connection Monitor
 * Displays detailed WebSocket connection status and metrics
 */

'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface ConnectionMetrics {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  latency: number;
  messagesSent: number;
  messagesReceived: number;
  bytesTransferred: number;
  reconnectAttempts: number;
  lastError?: string;
  uptime: number;
  subscriptions: string[];
}

interface WebSocketMonitorProps {
  url?: string;
  detailed?: boolean;
  showChart?: boolean;
}

export function WebSocketMonitor({ 
  url, 
  detailed = false,
  showChart = false 
}: WebSocketMonitorProps) {
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    status: 'disconnected',
    latency: 0,
    messagesSent: 0,
    messagesReceived: 0,
    bytesTransferred: 0,
    reconnectAttempts: 0,
    uptime: 0,
    subscriptions: [],
  });

  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const { isConnected, error, sendMessage, lastMessage } = useWebSocket({
    url: url || process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
    autoConnect: true,
  });

  // Update connection status
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      status: error ? 'error' : isConnected ? 'connected' : 'disconnected',
      lastError: error || undefined,
    }));

    if (isConnected && !startTime) {
      setStartTime(Date.now());
    }
  }, [isConnected, error, startTime]);

  // Track uptime
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          uptime: Math.floor((Date.now() - startTime) / 1000),
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected, startTime]);

  // Track messages
  useEffect(() => {
    if (lastMessage) {
      const bytes = new Blob([lastMessage]).size;
      setMetrics(prev => ({
        ...prev,
        messagesReceived: prev.messagesReceived + 1,
        bytesTransferred: prev.bytesTransferred + bytes,
      }));
    }
  }, [lastMessage]);

  // Ping for latency measurement
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        const pingTime = Date.now();
        sendMessage({ type: 'ping', timestamp: pingTime });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isConnected, sendMessage]);

  // Handle pong responses
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'pong' && data.timestamp) {
          const latency = Date.now() - data.timestamp;
          setMetrics(prev => ({ ...prev, latency }));
          setLatencyHistory(prev => [...prev.slice(-20), latency]);
        }
      } catch {
        // Not a JSON message
      }
    }
  }, [lastMessage]);

  const getStatusColor = (status: ConnectionMetrics['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: ConnectionMetrics['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const avgLatency = latencyHistory.length > 0
    ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)
    : 0;

  if (!detailed) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(metrics.status)} ${metrics.status === 'connected' ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium">{getStatusText(metrics.status)}</span>
        {metrics.status === 'connected' && (
          <span className="text-xs text-gray-500">• {metrics.latency}ms</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">WebSocket Monitor</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.status)} ${metrics.status === 'connected' ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{getStatusText(metrics.status)}</span>
        </div>
      </div>

      {/* Connection Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Latency</div>
          <div className="text-2xl font-bold">
            {metrics.latency > 0 ? `${metrics.latency}ms` : '—'}
          </div>
          <div className="text-xs text-gray-500">Avg: {avgLatency}ms</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Messages</div>
          <div className="text-2xl font-bold">{metrics.messagesReceived}</div>
          <div className="text-xs text-gray-500">Sent: {metrics.messagesSent}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Data Transfer</div>
          <div className="text-2xl font-bold">{formatBytes(metrics.bytesTransferred)}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Uptime</div>
          <div className="text-2xl font-bold">{formatUptime(metrics.uptime)}</div>
          <div className="text-xs text-gray-500">
            Reconnects: {metrics.reconnectAttempts}
          </div>
        </div>
      </div>

      {/* Latency Chart */}
      {showChart && latencyHistory.length > 0 && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Latency History</div>
          <div className="h-24 flex items-end gap-1">
            {latencyHistory.map((latency, index) => {
              const maxLatency = Math.max(...latencyHistory);
              const height = (latency / maxLatency) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${latency}ms`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Subscriptions */}
      {metrics.subscriptions.length > 0 && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Active Subscriptions</div>
          <div className="flex flex-wrap gap-2">
            {metrics.subscriptions.map((sub) => (
              <span
                key={sub}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {metrics.lastError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm font-medium text-red-800 mb-1">Last Error</div>
          <div className="text-sm text-red-600">{metrics.lastError}</div>
        </div>
      )}

      {/* Connection Info */}
      <div className="text-xs text-gray-500 mt-4">
        <div>Endpoint: {url || 'Default'}</div>
        <div>Protocol: WebSocket (wss://)</div>
      </div>
    </div>
  );
}

