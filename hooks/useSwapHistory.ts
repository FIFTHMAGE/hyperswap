/**
 * Custom hook for managing swap history
 */

import { useState, useEffect } from 'react';
import { SwapHistoryItem, SwapAnalytics, HistoryFilters } from '@/lib/types/history';

const HISTORY_KEY = 'hyperswap_history';

export function useSwapHistory() {
  const [history, setHistory] = useState<SwapHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = (newHistory: SwapHistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addTransaction = (transaction: SwapHistoryItem) => {
    const newHistory = [transaction, ...history];
    saveHistory(newHistory);
  };

  const updateTransaction = (id: string, updates: Partial<SwapHistoryItem>) => {
    const newHistory = history.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all swap history?')) {
      saveHistory([]);
    }
  };

  const filterHistory = (filters: HistoryFilters): SwapHistoryItem[] => {
    return history.filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.chainId && item.chainId !== filters.chainId) return false;
      if (filters.dateFrom && item.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && item.timestamp > filters.dateTo) return false;
      if (
        filters.tokens &&
        !filters.tokens.includes(item.inputToken.address) &&
        !filters.tokens.includes(item.outputToken.address)
      ) {
        return false;
      }
      if (filters.providers && !filters.providers.includes(item.provider)) {
        return false;
      }
      return true;
    });
  };

  const getAnalytics = (): SwapAnalytics => {
    const successfulSwaps = history.filter((item) => item.status === 'success');
    const totalVolumeUSD = successfulSwaps.reduce(
      (sum, item) => sum + (item.inputValueUSD || 0),
      0
    );
    const totalGasCostUSD = successfulSwaps.reduce(
      (sum, item) => sum + (item.gasCostUSD || 0),
      0
    );

    // Calculate most traded token
    const tokenCounts = new Map<string, { symbol: string; address: string; count: number }>();
    successfulSwaps.forEach((swap) => {
      [swap.inputToken, swap.outputToken].forEach((token) => {
        const current = tokenCounts.get(token.address) || {
          symbol: token.symbol,
          address: token.address,
          count: 0,
        };
        current.count++;
        tokenCounts.set(token.address, current);
      });
    });
    const mostTraded = Array.from(tokenCounts.values()).sort(
      (a, b) => b.count - a.count
    )[0];

    // Calculate favorite provider
    const providerCounts = new Map<string, number>();
    successfulSwaps.forEach((swap) => {
      providerCounts.set(swap.provider, (providerCounts.get(swap.provider) || 0) + 1);
    });
    const favoriteProvider = Array.from(providerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))[0];

    // Calculate trading activity by day
    const activityMap = new Map<string, { count: number; volume: number }>();
    successfulSwaps.forEach((swap) => {
      const date = new Date(swap.timestamp).toISOString().split('T')[0];
      const current = activityMap.get(date) || { count: 0, volume: 0 };
      current.count++;
      current.volume += swap.inputValueUSD || 0;
      activityMap.set(date, current);
    });

    const tradingActivity = Array.from(activityMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalSwaps: history.length,
      totalVolumeUSD,
      totalGasCostUSD,
      averageGasCost: successfulSwaps.length > 0 ? totalGasCostUSD / successfulSwaps.length : 0,
      successRate: history.length > 0 ? (successfulSwaps.length / history.length) * 100 : 0,
      mostTradedToken: mostTraded || { symbol: 'N/A', address: '', count: 0 },
      favoriteProvider: favoriteProvider || { name: 'N/A', count: 0 },
      profitLoss: 0, // This would require price tracking
      tradingActivity,
    };
  };

  return {
    history,
    loading,
    addTransaction,
    updateTransaction,
    clearHistory,
    filterHistory,
    getAnalytics,
  };
}

