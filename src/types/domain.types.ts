/**
 * Domain-specific type definitions for business logic
 * @module domain.types
 */

import { Address, Token, TokenAmount, ChainId, Hash } from './blockchain.types';

// ============================================================================
// SWAP DOMAIN
// ============================================================================

/** Swap types supported by the platform */
export type SwapType = 'market' | 'limit' | 'dca' | 'twap';

/** DEX protocols */
export type DexProtocol =
  | 'uniswap-v2'
  | 'uniswap-v3'
  | 'sushiswap'
  | 'curve'
  | 'balancer'
  | '1inch'
  | 'other';

/**
 * Comprehensive swap quote with routing and pricing
 */
export interface SwapQuote {
  from: TokenAmount;
  to: TokenAmount;
  route: SwapRoute;
  priceImpact: number;
  minimumReceived: string;
  slippage: number;
  gasEstimate: string;
  fees: SwapFees;
  expiresAt: number;
  quoteId: string;
  type: SwapType;
}

/**
 * Swap routing information
 */
export interface SwapRoute {
  path: Token[];
  pools: RoutePool[];
  hops: number;
  percentage?: number;
  protocol: DexProtocol;
}

/**
 * Pool in a swap route
 */
export interface RoutePool {
  address: Address;
  token0: Token;
  token1: Token;
  fee: number;
  protocol: DexProtocol;
}

/**
 * Breakdown of swap fees
 */
export interface SwapFees {
  protocol: string;
  protocolPercentage: number;
  gas: string;
  gasUSD?: string;
  total: string;
  totalUSD?: string;
}

/**
 * Swap transaction with metadata
 */
export interface SwapTransaction {
  id: string;
  from: TokenAmount;
  to: TokenAmount;
  quote: SwapQuote;
  status: SwapStatus;
  hash?: Hash;
  timestamp: number;
  completedAt?: number;
  error?: string;
  actualReceived?: string;
}

/**
 * Swap status tracking
 */
export type SwapStatus =
  | 'pending'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
  | 'expired';

/**
 * Swap settings and preferences
 */
export interface SwapSettings {
  slippage: number;
  deadline: number;
  disableMultihops: boolean;
  expertMode: boolean;
  mevProtection: boolean;
  autoRouterEnabled: boolean;
}

// ============================================================================
// LIQUIDITY POOL DOMAIN
// ============================================================================

/** Pool types */
export type PoolType = 'constant-product' | 'stable' | 'weighted' | 'concentrated';

/** Pool version */
export type PoolVersion = 'v2' | 'v3' | 'v4';

/**
 * Comprehensive liquidity pool information
 */
export interface Pool {
  address: Address;
  chainId: ChainId;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  liquidity: string;
  liquidityUSD: string;
  volume24h: string;
  volume7d: string;
  fees24h: string;
  apr: number;
  apy: number;
  protocol: DexProtocol;
  type: PoolType;
  version: PoolVersion;
  feeTier?: number;
  verified: boolean;
}

/**
 * User's liquidity position in a pool
 */
export interface PoolPosition {
  id: string;
  pool: Pool;
  liquidity: string;
  shares: string;
  sharePercentage: number;
  token0Amount: TokenAmount;
  token1Amount: TokenAmount;
  value: string;
  valueUSD: string;
  fees: PositionFees;
  impermanentLoss: ImpermanentLoss;
  openedAt: number;
}

/**
 * Accumulated fees from liquidity position
 */
export interface PositionFees {
  token0: string;
  token1: string;
  total: string;
  totalUSD: string;
  claimed: boolean;
}

/**
 * Impermanent loss calculation
 */
export interface ImpermanentLoss {
  percentage: number;
  amount: string;
  amountUSD: string;
}

// ============================================================================
// PORTFOLIO DOMAIN
// ============================================================================

/**
 * Multi-chain portfolio aggregation
 */
export interface Portfolio {
  address: Address;
  chains: ChainPortfolio[];
  totalValue: string;
  totalValueUSD: string;
  change24h: number;
  change7d: number;
  lastUpdated: number;
}

/**
 * Portfolio for a specific chain
 */
export interface ChainPortfolio {
  chainId: ChainId;
  totalValue: string;
  tokens: TokenBalance[];
  pools: PoolPosition[];
  nfts: NFTBalance[];
  protocols: ProtocolPosition[];
}

/**
 * Token balance with market data
 */
export interface TokenBalance {
  token: Token;
  balance: string;
  formatted: string;
  value: string;
  valueUSD: string;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  allocation: number;
}

/**
 * NFT holdings
 */
export interface NFTBalance {
  address: Address;
  tokenId: string;
  name: string;
  collection: string;
  image: string;
  value?: string;
  valueUSD?: string;
  floorPrice?: string;
  lastSale?: string;
}

/**
 * Position in DeFi protocols
 */
export interface ProtocolPosition {
  protocol: string;
  type: 'lending' | 'staking' | 'farming' | 'vault';
  value: string;
  valueUSD: string;
  apy: number;
  rewards: TokenAmount[];
}

/**
 * Portfolio historical snapshot
 */
export interface PortfolioHistory {
  timestamp: number;
  value: string;
  valueUSD: string;
  change24h: number;
  tokens: TokenBalance[];
  transactions: number;
}

/**
 * Portfolio analytics and metrics
 */
export interface PortfolioMetrics {
  totalInvested: string;
  currentValue: string;
  profitLoss: string;
  profitLossPercentage: number;
  bestPerformer: TokenBalance;
  worstPerformer: TokenBalance;
  diversification: number;
  riskScore: number;
}

// ============================================================================
// TRANSACTION DOMAIN
// ============================================================================

/** Transaction types in the application */
export type TransactionType =
  | 'swap'
  | 'transfer'
  | 'approval'
  | 'liquidity_add'
  | 'liquidity_remove'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'bridge'
  | 'other';

/**
 * Enhanced transaction metadata
 */
export interface TransactionMetadata {
  type: TransactionType;
  description: string;
  value?: string;
  valueUSD?: string;
  fee?: string;
  feeUSD?: string;
  tokens?: Token[];
  counterparty?: Address;
  method?: string;
}

/**
 * Transaction history entry
 */
export interface TransactionHistory {
  hash: Hash;
  chainId: ChainId;
  from: Address;
  to: Address;
  metadata: TransactionMetadata;
  status: SwapStatus;
  timestamp: number;
  blockNumber: number;
}

// ============================================================================
// PRICE & MARKET DATA DOMAIN
// ============================================================================

/**
 * Token price with market data
 */
export interface Price {
  token: Token;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volume24h: string;
  volume7d: string;
  marketCap?: string;
  fullyDilutedMarketCap?: string;
  circulatingSupply?: string;
  totalSupply?: string;
  timestamp: number;
}

/**
 * Historical price data point
 */
export interface PriceDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Chart data for visualizations
 */
export interface ChartData {
  timestamp: number;
  value: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

/** Chart timeframe options */
export type ChartTimeframe = '1H' | '4H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

/** Chart type */
export type ChartType = 'line' | 'area' | 'candlestick' | 'bar';

// ============================================================================
// ALERTS & NOTIFICATIONS
// ============================================================================

/** Alert types */
export type AlertType = 'price' | 'volume' | 'liquidity' | 'transaction';

/** Alert condition operators */
export type AlertCondition =
  | 'above'
  | 'below'
  | 'crosses_above'
  | 'crosses_below'
  | 'percent_change';

/**
 * Price alert configuration
 */
export interface PriceAlert {
  id: string;
  token: Token;
  condition: AlertCondition;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  triggered: boolean;
  createdAt: number;
  triggeredAt?: number;
  notificationChannels: NotificationChannel[];
}

/** Notification delivery channels */
export type NotificationChannel = 'push' | 'email' | 'webhook' | 'telegram';

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Trading performance analytics
 */
export interface TradingAnalytics {
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  totalVolume: string;
  totalVolumeUSD: string;
  totalFees: string;
  totalFeesUSD: string;
  averageSlippage: number;
  averageGasPrice: string;
  profitLoss: string;
  profitLossPercentage: number;
  winRate: number;
}
