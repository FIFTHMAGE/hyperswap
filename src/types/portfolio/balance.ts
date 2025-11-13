/**
 * Portfolio balance types
 * @module types/portfolio/balance
 */

import type { Address, ChainId } from '../blockchain';
import type { TokenWithBalance } from '../token';

/**
 * Portfolio balance snapshot
 */
export interface PortfolioBalance {
  address: Address;
  totalValueUSD: number;
  tokens: TokenWithBalance[];
  chainBalances: Record<ChainId, ChainBalance>;
  timestamp: number;
}

/**
 * Balance per chain
 */
export interface ChainBalance {
  chainId: ChainId;
  totalValueUSD: number;
  nativeBalance: string;
  nativeValueUSD: number;
  tokens: TokenWithBalance[];
}

/**
 * Portfolio allocation
 */
export interface PortfolioAllocation {
  byChain: Record<ChainId, number>;
  byToken: Array<{
    token: TokenWithBalance;
    percentage: number;
  }>;
  byProtocol: Array<{
    protocol: string;
    valueUSD: number;
    percentage: number;
  }>;
}

/**
 * Portfolio diversification metrics
 */
export interface DiversificationMetrics {
  herfindahlIndex: number;
  numberOfAssets: number;
  numberOfChains: number;
  largestPosition: number;
  top5Concentration: number;
}

