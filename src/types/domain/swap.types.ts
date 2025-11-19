/**
 * Swap domain types
 * @module types/domain/swap
 */

import type { Address, ChainId } from '../blockchain';

/**
 * Swap quote from aggregators
 */
export interface SwapQuote {
  fromToken: Address;
  toToken: Address;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: number;
  route: SwapRoute[];
  estimatedGas: string;
  gasCost: string;
  aggregator: string;
  validUntil: number;
}

/**
 * Swap route hop
 */
export interface SwapRoute {
  protocol: string;
  poolAddress: Address;
  fromToken: Address;
  toToken: Address;
  percentage: number;
}

/**
 * Swap settings
 */
export interface SwapSettings {
  slippage: number;
  deadline: number;
  expertMode: boolean;
  multihop: boolean;
}

/**
 * Swap status
 */
export type SwapStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'failed' | 'cancelled';

/**
 * Swap transaction
 */
export interface SwapTransaction {
  id: string;
  chainId: ChainId;
  fromToken: Address;
  toToken: Address;
  fromAmount: string;
  toAmount: string;
  status: SwapStatus;
  txHash?: string;
  timestamp: number;
  userAddress: Address;
}
