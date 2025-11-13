/**
 * Liquidity pool types
 * @module types/liquidity/pool
 */

import type { Address, ChainId } from '../blockchain';
import type { Token } from '../token';

/**
 * Liquidity pool
 */
export interface LiquidityPool {
  address: Address;
  chainId: ChainId;
  protocol: string;
  type: 'v2' | 'v3' | 'stable' | 'weighted';
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  fee: number;
  tvl: number;
  volume24h: number;
  volumeChange24h: number;
  fees24h: number;
  apy: number;
  apr: number;
}

/**
 * Pool analytics over time
 */
export interface PoolAnalytics {
  pool: Address;
  timeframe: '24h' | '7d' | '30d' | '1y';
  metrics: {
    tvl: number;
    volume: number;
    fees: number;
    apy: number;
    transactions: number;
  };
  history: Array<{
    timestamp: number;
    tvl: number;
    volume: number;
    fees: number;
    price: number;
  }>;
}

/**
 * Pool filters for discovery
 */
export interface PoolFilters {
  minTVL?: number;
  minVolume24h?: number;
  minAPY?: number;
  protocols?: string[];
  tokens?: Address[];
  sortBy?: 'tvl' | 'volume' | 'apy' | 'fees';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Pool pair data
 */
export interface PoolPair {
  token0: Token;
  token1: Token;
  pools: LiquidityPool[];
}

