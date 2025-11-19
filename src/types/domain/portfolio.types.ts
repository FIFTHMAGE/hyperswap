/**
 * Portfolio domain types
 * @module types/domain/portfolio
 */

import type { Address, ChainId } from '../blockchain';

/**
 * Portfolio overview
 */
export interface PortfolioOverview {
  totalValue: number;
  totalChange24h: number;
  totalChangePercentage24h: number;
  chains: ChainPortfolio[];
  lastUpdated: number;
}

/**
 * Chain-specific portfolio
 */
export interface ChainPortfolio {
  chainId: ChainId;
  value: number;
  change24h: number;
  tokens: TokenHolding[];
}

/**
 * Token holding
 */
export interface TokenHolding {
  address: Address;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price: number;
  value: number;
  change24h: number;
  chainId: ChainId;
}

/**
 * Portfolio allocation
 */
export interface PortfolioAllocation {
  token: string;
  percentage: number;
  value: number;
}

/**
 * PnL data
 */
export interface PnLData {
  realized: number;
  unrealized: number;
  total: number;
  percentage: number;
}
