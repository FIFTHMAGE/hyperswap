/**
 * Liquidity position types
 * @module types/liquidity/position
 */

import type { Address, TxHash } from '../blockchain';
import type { LiquidityPool } from './pool';

/**
 * LP token position
 */
export interface PoolPosition {
  id: string;
  pool: LiquidityPool;
  owner: Address;
  liquidity: string;
  token0Amount: string;
  token1Amount: string;
  valueUSD: number;
  share: number; // percentage of pool
  unclaimedFees0: string;
  unclaimedFees1: string;
  unclaimedFeesUSD: number;
  entryPrice0: number;
  entryPrice1: number;
  currentPrice0: number;
  currentPrice1: number;
  impermanentLoss: number;
  impermanentLossUSD: number;
  pnl: number;
  pnlUSD: number;
  createdAt: number;
  lastUpdated: number;
}

/**
 * Position history entry
 */
export interface PositionHistoryEntry {
  position: string;
  type: 'add' | 'remove' | 'claim';
  amount0: string;
  amount1: string;
  liquidity: string;
  tx Hash: TxHash;
  timestamp: number;
}

/**
 * Impermanent loss calculation
 */
export interface ImpermanentLoss {
  position: string;
  initialValue: number;
  currentValue: number;
  holdValue: number;
  impermanentLoss: number;
  impermanentLossPercentage: number;
}

