/**
 * Swap Types
 * Comprehensive type definitions for swap operations
 */

/**
 * Token information
 */
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
  isNative?: boolean;
}

/**
 * Token with balance
 */
export interface TokenWithBalance extends Token {
  balance: string;
  balanceUSD?: string;
}

/**
 * Swap parameters
 */
export interface SwapParams {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  slippage: number;
  deadline?: number;
  recipient?: string;
}

/**
 * Swap quote
 */
export interface SwapQuote {
  id: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  exchangeRate: number;
  priceImpact: number;
  route: SwapRoute;
  gasEstimate: string;
  gasCostUSD?: string;
  fee: string;
  feeUSD?: string;
  validUntil: Date;
}

/**
 * Swap route
 */
export interface SwapRoute {
  path: string[];
  pools: Pool[];
  protocol: Protocol;
}

/**
 * Liquidity pool
 */
export interface Pool {
  address: string;
  token0: Token;
  token1: Token;
  fee: number;
  liquidity: string;
  sqrtPriceX96?: string;
  tick?: number;
  protocol: Protocol;
}

/**
 * Supported protocols/DEXs
 */
export type Protocol = 
  | 'uniswap_v2'
  | 'uniswap_v3'
  | 'sushiswap'
  | 'curve'
  | 'balancer'
  | '1inch'
  | 'paraswap';

/**
 * Swap status
 */
export type SwapStatus =
  | 'idle'
  | 'quoting'
  | 'approving'
  | 'swapping'
  | 'confirming'
  | 'success'
  | 'failed';

/**
 * Swap transaction
 */
export interface SwapTransaction {
  hash: string;
  status: SwapStatus;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  expectedAmount: string;
  slippage: number;
  priceImpact: number;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  timestamp: Date;
  protocol: Protocol;
}

/**
 * Swap settings
 */
export interface SwapSettings {
  slippage: number;
  deadline: number;
  expertMode: boolean;
  multihop: boolean;
  gasPreference: 'low' | 'medium' | 'high' | 'custom';
  customGasPrice?: string;
}

/**
 * Price impact level
 */
export type PriceImpactLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Token list
 */
export interface TokenList {
  name: string;
  logoURI?: string;
  tokens: Token[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  timestamp: string;
}

/**
 * Swap history item
 */
export interface SwapHistoryItem {
  id: string;
  transactionHash: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  exchangeRate: number;
  priceImpact: number;
  gasUsed: string;
  gasCostUSD: string;
  protocol: Protocol;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  blockNumber?: number;
}

/**
 * Token approval
 */
export interface TokenApproval {
  token: Token;
  spender: string;
  amount: string;
  isUnlimited: boolean;
}

/**
 * Swap error
 */
export interface SwapError {
  code: SwapErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export type SwapErrorCode =
  | 'INSUFFICIENT_BALANCE'
  | 'INSUFFICIENT_LIQUIDITY'
  | 'PRICE_IMPACT_TOO_HIGH'
  | 'SLIPPAGE_EXCEEDED'
  | 'TRANSACTION_REVERTED'
  | 'APPROVAL_FAILED'
  | 'QUOTE_EXPIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Pool stats
 */
export interface PoolStats {
  address: string;
  tvl: string;
  tvlUSD: string;
  volume24h: string;
  volume24hUSD: string;
  fees24h: string;
  fees24hUSD: string;
  apy: number;
}

/**
 * Swap analytics
 */
export interface SwapAnalytics {
  totalSwaps: number;
  totalVolumeUSD: string;
  uniqueTokens: number;
  mostSwappedPairs: Array<{
    from: Token;
    to: Token;
    count: number;
    volumeUSD: string;
  }>;
  averageSlippage: number;
  averagePriceImpact: number;
}

