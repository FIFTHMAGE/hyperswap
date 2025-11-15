/**
 * Real-time Portfolio Tracking Hook
 * Monitors portfolio value and changes in real-time
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export interface PortfolioHolding {
  token: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  changePercent24h: number;
}

export interface PortfolioData {
  totalValue: number;
  change24h: number;
  changePercent24h: number;
  holdings: PortfolioHolding[];
  lastUpdate: number;
}

export interface RealtimePortfolioConfig {
  walletAddress: string;
  chain: string;
  updateInterval?: number;
  autoConnect?: boolean;
}

export function useRealtimePortfolio(config: RealtimePortfolioConfig) {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    isConnected,
    lastMessage,
    sendMessage,
  } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
    autoConnect: config.autoConnect ?? true,
    reconnect: true,
  });

  // Subscribe to portfolio updates
  useEffect(() => {
    if (isConnected && config.walletAddress) {
      sendMessage({
        type: 'subscribe',
        channel: 'portfolio',
        params: {
          wallet: config.walletAddress,
          chain: config.chain,
          interval: config.updateInterval || 5000,
        },
      });

      return () => {
        sendMessage({
          type: 'unsubscribe',
          channel: 'portfolio',
          params: { wallet: config.walletAddress },
        });
      };
    }
  }, [isConnected, config.walletAddress, config.chain, config.updateInterval, sendMessage]);

  // Handle incoming portfolio updates
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.channel === 'portfolio' && data.wallet === config.walletAddress) {
          setPortfolio({
            totalValue: data.totalValue,
            change24h: data.change24h,
            changePercent24h: data.changePercent24h,
            holdings: data.holdings,
            lastUpdate: Date.now(),
          });
          setIsLoading(false);
          setError(null);
        }

        if (data.type === 'error') {
          setError(data.message);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error parsing portfolio data:', err);
      }
    }
  }, [lastMessage, config.walletAddress]);

  // Calculate holding percentage
  const getHoldingPercentage = useCallback((holding: PortfolioHolding): number => {
    if (!portfolio || portfolio.totalValue === 0) return 0;
    return (holding.value / portfolio.totalValue) * 100;
  }, [portfolio]);

  // Get top holdings by value
  const getTopHoldings = useCallback((count: number = 5): PortfolioHolding[] => {
    if (!portfolio) return [];
    return [...portfolio.holdings]
      .sort((a, b) => b.value - a.value)
      .slice(0, count);
  }, [portfolio]);

  // Calculate diversification score (0-100)
  const getDiversificationScore = useCallback((): number => {
    if (!portfolio || portfolio.holdings.length === 0) return 0;
    
    // Calculate Herfindahl index
    const herfindahl = portfolio.holdings.reduce((sum, holding) => {
      const percentage = getHoldingPercentage(holding);
      return sum + Math.pow(percentage / 100, 2);
    }, 0);
    
    // Convert to diversification score (inverse of concentration)
    return Math.round((1 - herfindahl) * 100);
  }, [portfolio, getHoldingPercentage]);

  // Refresh portfolio data
  const refresh = useCallback(() => {
    if (isConnected) {
      sendMessage({
        type: 'refresh',
        channel: 'portfolio',
        params: { wallet: config.walletAddress },
      });
    }
  }, [isConnected, sendMessage, config.walletAddress]);

  return {
    portfolio,
    isLoading,
    error,
    isConnected,
    getHoldingPercentage,
    getTopHoldings,
    getDiversificationScore,
    refresh,
  };
}

