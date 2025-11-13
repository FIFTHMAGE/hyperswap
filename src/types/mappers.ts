/**
 * Type mapping utilities
 * @module types/mappers
 */

import type { Token, TokenWithBalance } from './token';
import type { ChainId } from './blockchain';

/**
 * Map token to token with balance
 */
export function mapToTokenWithBalance(
  token: Token,
  balance: string,
  balanceUSD?: number
): TokenWithBalance {
  return {
    ...token,
    balance,
    balanceFormatted: formatBalance(balance, token.decimals),
    balanceUSD,
  };
}

/**
 * Format balance with decimals
 */
function formatBalance(balance: string, decimals: number): string {
  const value = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  
  if (fraction === 0n) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr}`.replace(/\.?0+$/, '');
}

/**
 * Map chain ID to chain name
 */
export function mapChainIdToName(chainId: ChainId): string {
  const chainNames: Record<ChainId, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
    8453: 'Base',
    43114: 'Avalanche',
  };
  
  return chainNames[chainId] || 'Unknown';
}

/**
 * Map status to color
 */
export function mapStatusToColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'yellow',
    confirmed: 'green',
    success: 'green',
    failed: 'red',
    error: 'red',
    cancelled: 'gray',
  };
  
  return colorMap[status] || 'gray';
}

/**
 * Map value to display string
 */
export function mapValueToDisplay(value: number, currency: string = 'USD'): string {
  if (value === 0) return `${currency} 0`;
  if (value < 0.01) return `< ${currency} 0.01`;
  if (value >= 1000000) return `${currency} ${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${currency} ${(value / 1000).toFixed(2)}K`;
  return `${currency} ${value.toFixed(2)}`;
}

