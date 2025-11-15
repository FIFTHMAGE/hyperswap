/**
 * Real-time Analytics Metrics
 * Displays live trading metrics and market statistics
 */

'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Metric {
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface MarketMetrics {
  totalVolume24h: number;
  totalTrades24h: number;
  activeUsers: number;
  avgTradeSize: number;
  topGainer: {
    symbol: string;
    change: number;
  };
  topLoser: {
    symbol: string;
    change: number;
  };
  gasPrice: {
    average: number;
    fast: number;
    instant: number;
  };
  timestamp: number;
}

interface RealtimeMetricsProps {
  compact?: boolean;
  metrics?: string[]; // Filter specific metrics
  updateInterval?: number;
}

export function RealtimeMetrics({ 
  compact = false, 
  metrics: selectedMetrics,
  updateInterval = 3000 
}: RealtimeMetricsProps) {
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [pulse, setPulse] = useState(false);

  const { isConnected, lastMessage, sendMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
    autoConnect: true,
  });

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        channel: 'market-metrics',
        params: { interval: updateInterval },
      });

      return () => {
        sendMessage({
          type: 'unsubscribe',
          channel: 'market-metrics',
        });
      };
    }
  }, [isConnected, updateInterval, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.channel === 'market-metrics') {
          setMetrics(data.metrics);
          setPulse(true);
          setTimeout(() => setPulse(false), 300);
        }
      } catch (err) {
        console.error('Error parsing metrics:', err);
      }
    }
  }, [lastMessage]);

  if (!metrics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const formatNumber = (num: number, decimals = 2): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatCount = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const allMetrics: Metric[] = [
    {
      label: '24h Volume',
      value: formatNumber(metrics.totalVolume24h),
      trend: 'up',
    },
    {
      label: '24h Trades',
      value: formatCount(metrics.totalTrades24h),
    },
    {
      label: 'Active Users',
      value: formatCount(metrics.activeUsers),
    },
    {
      label: 'Avg Trade Size',
      value: formatNumber(metrics.avgTradeSize),
    },
    {
      label: 'Top Gainer',
      value: `${metrics.topGainer.symbol} +${metrics.topGainer.change.toFixed(2)}%`,
      trend: 'up',
    },
    {
      label: 'Top Loser',
      value: `${metrics.topLoser.symbol} ${metrics.topLoser.change.toFixed(2)}%`,
      trend: 'down',
    },
    {
      label: 'Gas (Average)',
      value: `${metrics.gasPrice.average.toFixed(2)} gwei`,
    },
    {
      label: 'Gas (Fast)',
      value: `${metrics.gasPrice.fast.toFixed(2)} gwei`,
    },
  ];

  const displayMetrics = selectedMetrics
    ? allMetrics.filter(m => selectedMetrics.includes(m.label))
    : allMetrics;

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-4">
        {displayMetrics.map((metric, index) => (
          <div
            key={index}
            className={`
              bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200
              transition-all duration-300
              ${pulse ? 'scale-105 border-blue-400' : ''}
            `}
          >
            <div className="text-xs text-gray-500">{metric.label}</div>
            <div className={`text-lg font-bold ${getTrendColor(metric.trend)}`}>
              {metric.value} {getTrendIcon(metric.trend)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayMetrics.map((metric, index) => (
        <div
          key={index}
          className={`
            bg-white rounded-lg p-4 shadow-md border-2
            transition-all duration-300
            ${pulse ? 'border-blue-400 shadow-lg' : 'border-transparent'}
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm text-gray-600">{metric.label}</div>
            {metric.trend && (
              <span className={`text-xl ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold">{metric.value}</div>
          
          {/* Live indicator */}
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isConnected ? 'Live' : 'Disconnected'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

