/**
 * Swap-related type definitions
 * @module types/swap
 */

import type { Address, ChainId, TxHash } from '../blockchain';
import type { Token } from '../token';

/**
 * Swap quote from a DEX aggregator
 */
export interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  minimumReceived: string;
  priceImpact: number;
  route: SwapRoute;
  gasEstimate: string;
  gasEstimateUSD?: number;
  provider: string;
  protocols: string[];
  timestamp: number;
  expiresAt: number;
}

/**
 * Swap route through DEXes
 */
export interface SwapRoute {
  path: Address[];
  pools: SwapPool[];
  distribution: number[];
  hops: number;
}

/**
 * Pool in swap route
 */
export interface SwapPool {
  address: Address;
  protocol: string;
  fee: number;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
}

/**
 * Swap settings/preferences
 */
export interface SwapSettings {
  slippage: number; // percentage 0-100
  deadline: number; // minutes
  recipient?: Address;
  expert Mode: boolean;
  disableMultihops: boolean;
  maxHops: number;
}

/**
 * Default swap settings
 */
export const DEFAULT_SWAP_SETTINGS: SwapSettings = {
  slippage: 0.5,
  deadline: 20,
  expertMode: false,
  disableMultihops: false,
  maxHops: 3,
};

/**
 * Swap execution status
 */
export type SwapStatus =
  | 'pending'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'cancelled';

/**
 * Executed swap
 */
export interface ExecutedSwap {
  id: string;
  txHash: TxHash;
  from: Address;
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  actualOutputAmount?: string;
  priceImpact: number;
  gasUsed: string;
  gasCost: string;
  gasCostUSD?: number;
  status: SwapStatus;
  timestamp: number;
  blockNumber?: number;
  route: SwapRoute;
  provider: string;
}

/**
 * Swap history filter
 */
export interface SwapHistoryFilter {
  address?: Address;
  chainId?: ChainId;
  token?: Address;
  status?: SwapStatus;
  fromDate?: number;
  toDate?: number;
  minAmount?: string;
  maxAmount?: string;
}

/**
 * Swap statistics
 */
export interface SwapStatistics {
  totalSwaps: number;
  totalVolumeUSD: number;
  totalGasSpentUSD: number;
  averageSlippage: number;
  successRate: number;
  topTokens: Array<{
    token: Token;
    count: number;
    volumeUSD: number;
  }>;
  topPairs: Array<{
    token0: Token;
    token1: Token;
    count: number;
    volumeUSD: number;
  }>;
}

/**
 * Price comparison across DEXes
 */
export interface PriceComparison {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  quotes: Array<{
    provider: string;
    outputAmount: string;
    priceImpact: number;
    gasEstimate: string;
    route: SwapRoute;
  }>;
  bestQuote: SwapQuote;
  timestamp: number;
}

/**
 * Swap approval status
 */
export interface SwapApproval {
  token: Address;
  spender: Address;
  requiredAmount: string;
  currentAllowance: string;
  needsApproval: boolean;
  txHash?: TxHash;
  status: 'pending' | 'approved' | 'failed';
}

/**
 * Swap error types
 */
export type SwapErrorType =
  | 'insufficient_balance'
  | 'insufficient_liquidity'
  | 'slippage_exceeded'
  | 'deadline_exceeded'
  | 'approval_failed'
  | 'transaction_failed'
  | 'price_changed'
  | 'unknown';

/**
 * Swap error
 */
export interface SwapError {
  type: SwapErrorType;
  message: string;
  details?: any;
}

