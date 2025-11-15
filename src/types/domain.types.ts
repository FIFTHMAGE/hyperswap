/**
 * Domain-specific type definitions
 */

import { Address, Token, TokenAmount, ChainId } from './blockchain.types';

// Swap types
export interface SwapQuote {
  from: TokenAmount;
  to: TokenAmount;
  route: SwapRoute;
  priceImpact: number;
  minimumReceived: string;
  slippage: number;
  gasEstimate: string;
  fees: SwapFees;
}

export interface SwapRoute {
  path: Token[];
  pools: Pool[];
  hops: number;
}

export interface SwapFees {
  protocol: string;
  gas: string;
  total: string;
}

export interface SwapTransaction {
  from: TokenAmount;
  to: TokenAmount;
  quote: SwapQuote;
  status: TransactionStatus;
  hash?: string;
  timestamp: number;
}

// Pool types
export interface Pool {
  address: Address;
  chainId: ChainId;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  liquidity: string;
  volume24h: string;
  fees24h: string;
  apr: number;
  protocol: string;
}

export interface PoolPosition {
  pool: Pool;
  liquidity: string;
  shares: string;
  sharePercentage: number;
  token0Amount: TokenAmount;
  token1Amount: TokenAmount;
  value: string;
  fees: {
    token0: string;
    token1: string;
    total: string;
  };
}

// Portfolio types
export interface Portfolio {
  address: Address;
  chainId: ChainId;
  totalValue: string;
  tokens: TokenBalance[];
  pools: PoolPosition[];
  nfts: NFTBalance[];
  history: PortfolioHistory[];
}

export interface TokenBalance {
  token: Token;
  balance: string;
  formatted: string;
  value: string;
  price: number;
  priceChange24h: number;
}

export interface NFTBalance {
  address: Address;
  tokenId: string;
  name: string;
  collection: string;
  image: string;
  value?: string;
}

export interface PortfolioHistory {
  timestamp: number;
  value: string;
  change24h: number;
  tokens: TokenBalance[];
}

// Transaction types
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface TransactionMetadata {
  type: 'swap' | 'transfer' | 'approval' | 'liquidity' | 'other';
  description: string;
  value?: string;
  fee?: string;
}

// Price types
export interface Price {
  token: Token;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  volume24h: string;
  marketCap?: string;
  timestamp: number;
}

// Chart types
export interface ChartData {
  timestamp: number;
  value: number;
  volume?: number;
}

export type ChartTimeframe = '1H' | '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
