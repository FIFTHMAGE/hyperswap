/**
 * Wrapped story generator service
 * @module services/wrapped/generator
 */

import type { WrappedStats } from '@/types/wrapped/stats';
import type { WrappedCardConfig } from '@/types/wrapped/card';

/**
 * Generate wrapped story cards configuration
 */
export function generateStoryCards(stats: WrappedStats): WrappedCardConfig[] {
  const cards: WrappedCardConfig[] = [];
  
  // Welcome card
  cards.push({
    id: 'welcome',
    type: 'welcome',
    title: `Your ${stats.year} Crypto Journey`,
    data: {
      year: stats.year,
      address: stats.address,
    },
  });
  
  // Transactions card
  if (stats.totalTransactions > 0) {
    cards.push({
      id: 'transactions',
      type: 'stats',
      title: 'Transaction Activity',
      data: {
        count: stats.totalTransactions,
        label: 'transactions',
        icon: '📊',
      },
    });
  }
  
  // Gas spent card
  if (stats.totalGasSpentETH > 0) {
    cards.push({
      id: 'gas',
      type: 'stats',
      title: 'Gas Spent',
      data: {
        amount: stats.totalGasSpentETH,
        label: 'ETH',
        icon: '⛽',
      },
    });
  }
  
  // Volume card
  if (stats.totalVolumeUSD > 0) {
    cards.push({
      id: 'volume',
      type: 'stats',
      title: 'Total Volume',
      data: {
        amount: stats.totalVolumeUSD,
        label: 'USD',
        icon: '💰',
      },
    });
  }
  
  // Multi-chain card
  if (stats.chainsUsed > 1) {
    cards.push({
      id: 'chains',
      type: 'chains',
      title: 'Multi-Chain Explorer',
      data: {
        chainsCount: stats.chainsUsed,
      },
    });
  }
  
  // Portfolio value card
  if (stats.currentPortfolioValue > 0) {
    cards.push({
      id: 'portfolio',
      type: 'portfolio',
      title: 'Current Portfolio',
      data: {
        value: stats.currentPortfolioValue,
      },
    });
  }
  
  // Share card
  cards.push({
    id: 'share',
    type: 'share',
    title: 'Share Your Journey',
    data: {},
  });
  
  return cards;
}

/**
 * Generate shareable message
 */
export function generateShareMessage(stats: WrappedStats): string {
  return `My ${stats.year} Crypto Wrapped:\n` +
    `🔥 ${stats.totalTransactions} transactions\n` +
    `⛽ ${stats.totalGasSpentETH.toFixed(4)} ETH in gas\n` +
    `💰 $${stats.totalVolumeUSD.toLocaleString()} volume\n` +
    `🌐 ${stats.chainsUsed} chains explored\n\n` +
    `#CryptoWrapped ${stats.year}`;
}

/**
 * Generate card insights
 */
export function generateInsights(stats: WrappedStats): string[] {
  const insights: string[] = [];
  
  if (stats.totalTransactions > 100) {
    insights.push('Power user! You made over 100 transactions this year.');
  }
  
  if (stats.chainsUsed >= 3) {
    insights.push('True multi-chain explorer!');
  }
  
  if (stats.totalGasSpentETH > 1) {
    insights.push(`You spent ${stats.totalGasSpentETH.toFixed(2)} ETH on gas fees.`);
  }
  
  return insights;
}

