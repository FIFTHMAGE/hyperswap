/**
 * Year wrapped data aggregator service
 * @module services/wrapped/data-aggregator
 */

import type { WrappedStats } from '@/types/wrapped/stats';
import { getMultiChainHistory } from '../portfolio/transaction-history.service';
import { getMultiChainBalances } from '../portfolio/balance.service';

/**
 * Aggregate year wrapped data
 */
export async function aggregateWrappedData(
  address: string,
  year: number = new Date().getFullYear()
): Promise<WrappedStats> {
  const chainIds = [1, 137, 42161, 10, 8453]; // Major chains
  
  // Get transaction history
  const transactions = await getMultiChainHistory(address, chainIds as any, 1000);
  
  // Filter by year
  const yearStart = new Date(year, 0, 1).getTime() / 1000;
  const yearEnd = new Date(year + 1, 0, 1).getTime() / 1000;
  const yearTransactions = transactions.filter(
    tx => tx.timestamp >= yearStart && tx.timestamp < yearEnd
  );
  
  // Calculate stats
  const totalTransactions = yearTransactions.length;
  const totalGasSpent = yearTransactions.reduce(
    (sum, tx) => sum + (tx.gasSpent || 0),
    0
  );
  const totalVolume = yearTransactions.reduce(
    (sum, tx) => sum + (tx.valueUSD || 0),
    0
  );
  
  // Get current balances
  const portfolio = await getMultiChainBalances(address, chainIds as any);
  
  return {
    year,
    address,
    totalTransactions,
    totalGasSpentETH: totalGasSpent,
    totalVolumeUSD: totalVolume,
    chainsUsed: [...new Set(yearTransactions.map(tx => tx.chainId))].length,
    topTokens: [],
    nftActivity: {
      totalMinted: 0,
      totalPurchased: 0,
      totalSold: 0,
      totalSpent: 0,
    },
    defiActivity: {
      protocolsUsed: [],
      totalSwaps: 0,
      totalLiquidityProvided: 0,
    },
    currentPortfolioValue: portfolio.totalValueUSD,
  };
}

/**
 * Get year-over-year comparison
 */
export async function getYearComparison(
  address: string,
  currentYear: number
): Promise<{
  current: Partial<WrappedStats>;
  previous: Partial<WrappedStats>;
  growth: Record<string, number>;
}> {
  const [current, previous] = await Promise.all([
    aggregateWrappedData(address, currentYear),
    aggregateWrappedData(address, currentYear - 1),
  ]);
  
  return {
    current,
    previous,
    growth: {
      transactions: calculateGrowth(previous.totalTransactions, current.totalTransactions),
      volume: calculateGrowth(previous.totalVolumeUSD, current.totalVolumeUSD),
      chains: calculateGrowth(previous.chainsUsed, current.chainsUsed),
    },
  };
}

function calculateGrowth(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

