/**
 * Real-time Price Ticker
 * Displays live price updates in a scrolling ticker format
 */

'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface TickerItem {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
}

interface PriceTickerProps {
  tokens?: string[]; // If not provided, shows top tokens
  speed?: number; // Animation speed (px per second)
  compact?: boolean;
}

export function PriceTicker({ 
  tokens, 
  speed = 50,
  compact = false 
}: PriceTickerProps) {
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const { isConnected, lastMessage, sendMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
    autoConnect: true,
  });

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        channel: 'ticker',
        params: { tokens },
      });

      return () => {
        sendMessage({
          type: 'unsubscribe',
          channel: 'ticker',
        });
      };
    }
  }, [isConnected, tokens, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.channel === 'ticker') {
          setTickerData(data.items);
        }
      } catch (err) {
        console.error('Error parsing ticker data:', err);
      }
    }
  }, [lastMessage]);

  if (tickerData.length === 0) {
    return (
      <div className="bg-gray-100 py-3 px-4 overflow-hidden">
        <div className="animate-pulse text-gray-400">Loading ticker...</div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number): string => {
    return change >= 0 ? '▲' : '▼';
  };

  // Duplicate items for seamless loop
  const displayItems = [...tickerData, ...tickerData];

  if (compact) {
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div
          className={`flex whitespace-nowrap ${!isPaused ? 'animate-ticker' : ''}`}
          style={{
            animationDuration: `${(tickerData.length * 200) / speed}s`,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className="inline-flex items-center px-6 border-r border-gray-700"
            >
              <span className="font-bold mr-2">{item.symbol}</span>
              <span className="mr-2">{formatPrice(item.price)}</span>
              <span className={`text-sm ${getChangeColor(item.changePercent24h)}`}>
                {getChangeIcon(item.changePercent24h)} {Math.abs(item.changePercent24h).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-4 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Live Market' : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-sm px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div
        className={`flex whitespace-nowrap ${!isPaused ? 'animate-ticker' : ''}`}
        style={{
          animationDuration: `${(tickerData.length * 300) / speed}s`,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayItems.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="inline-flex flex-col px-8 border-r border-white/20 min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-lg">{item.symbol}</span>
              <span className={`text-sm font-medium ${getChangeColor(item.changePercent24h)}`}>
                {getChangeIcon(item.changePercent24h)} {Math.abs(item.changePercent24h).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">{formatPrice(item.price)}</span>
              <span className="text-xs text-gray-300">
                Vol: {formatVolume(item.volume24h)}
              </span>
            </div>
            <div className={`text-xs ${getChangeColor(item.change24h)} mt-1`}>
              {item.change24h >= 0 ? '+' : ''}{formatPrice(item.change24h)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

