/**
 * Liquidity domain types
 * @module types/domain/liquidity
 */

import type { Address, ChainId } from '../blockchain';

/**
 * Liquidity pool
 */
export interface LiquidityPool {
  address: Address;
  chainId: ChainId;
  protocol: string;
  token0: PoolToken;
  token1: PoolToken;
  tvl: number;
  volume24h: number;
  volume7d: number;
  apy: number;
  fee: number;
}

/**
 * Pool token
 */
export interface PoolToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  reserve: string;
  price: number;
}

/**
 * User position
 */
export interface LiquidityPosition {
  poolAddress: Address;
  chainId: ChainId;
  lpTokenBalance: string;
  token0Amount: string;
  token1Amount: string;
  share: number;
  value: number;
  depositedAt: number;
}

/**
 * Pool analytics
 */
export interface PoolAnalytics {
  volume24h: number;
  volume7d: number;
  volumeChange: number;
  tvl: number;
  tvlChange: number;
  fees24h: number;
  apy: number;
  priceChange24h: number;
  transactions24h: number;
}

/**
 * Impermanent loss data
 */
export interface ImpermanentLoss {
  percentage: number;
  amount: number;
  feeCompensation: number;
  netLoss: number;
}
