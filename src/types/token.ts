/**
 * Token-related type definitions
 * @module types/token
 */

import type { Address, ChainId } from './blockchain';

/**
 * Token standard types
 */
export type TokenStandard = 'ERC20' | 'ERC721' | 'ERC1155' | 'Native';

/**
 * Base token interface
 */
export interface BaseToken {
  address: Address;
  chainId: ChainId;
  decimals: number;
  symbol: string;
  name: string;
  logoURI?: string;
  standard: TokenStandard;
}

/**
 * ERC20 Token
 */
export interface Token extends BaseToken {
  standard: 'ERC20' | 'Native';
  totalSupply?: string;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
}

/**
 * Token with balance
 */
export interface TokenWithBalance extends Token {
  balance: string;
  balanceFormatted: string;
  balanceUSD?: number;
}

/**
 * NFT Token
 */
export interface NFTToken extends BaseToken {
  standard: 'ERC721' | 'ERC1155';
  tokenId: string;
  metadata?: NFTMetadata;
  collection?: NFTCollection;
}

/**
 * NFT Metadata
 */
export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  externalUrl?: string;
  attributes?: Array<{
    traitType: string;
    value: string | number;
    displayType?: string;
  }>;
  animationUrl?: string;
  backgroundColor?: string;
}

/**
 * NFT Collection
 */
export interface NFTCollection {
  address: Address;
  name: string;
  symbol: string;
  totalSupply?: number;
  floorPrice?: number;
  volume24h?: number;
  logoURI?: string;
  bannerURI?: string;
  description?: string;
  externalUrl?: string;
  verified: boolean;
}

/**
 * Token list
 */
export interface TokenList {
  name: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens: Token[];
  timestamp: number;
  logoURI?: string;
  keywords?: string[];
}

/**
 * Token price data
 */
export interface TokenPrice {
  token: Address;
  chainId: ChainId;
  price: number;
  priceUSD: number;
  timestamp: number;
  source: string;
}

/**
 * Token price history point
 */
export interface TokenPricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  marketCap?: number;
}

/**
 * Token price history
 */
export interface TokenPriceHistory {
  token: Address;
  chainId: ChainId;
  timeframe: '1h' | '24h' | '7d' | '30d' | '1y' | 'all';
  prices: TokenPricePoint[];
}

/**
 * Token metrics
 */
export interface TokenMetrics {
  token: Address;
  chainId: ChainId;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  marketCap: number;
  volume24h: number;
  volumeChange24h: number;
  circulatingSupply: number;
  totalSupply: number;
  holders: number;
  timestamp: number;
}

/**
 * Token approval
 */
export interface TokenApproval {
  token: Address;
  spender: Address;
  amount: string;
  amountFormatted: string;
  unlimited: boolean;
  txHash: string;
  timestamp: number;
}

/**
 * Token transfer
 */
export interface TokenTransfer {
  token: Address;
  from: Address;
  to: Address;
  amount: string;
  amountFormatted: string;
  amountUSD?: number;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  type: 'send' | 'receive';
}

/**
 * Token allowance
 */
export interface TokenAllowance {
  token: Address;
  owner: Address;
  spender: Address;
  amount: string;
  amountFormatted: string;
  unlimited: boolean;
}

/**
 * Token info from various sources
 */
export interface TokenInfo {
  address: Address;
  chainId: ChainId;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  coingeckoId?: string;
  coinmarketcapId?: string;
  tags?: string[];
  verified: boolean;
}

/**
 * Popular/trending token
 */
export interface TrendingToken extends Token {
  rank: number;
  trendingScore: number;
  searchVolume: number;
  priceChange24h: number;
  volume24h: number;
}

/**
 * Token search result
 */
export interface TokenSearchResult {
  token: Token;
  relevance: number;
  matchedFields: string[];
}

/**
 * Token pair (for swaps/liquidity)
 */
export interface TokenPair {
  token0: Token;
  token1: Token;
  chainId: ChainId;
}

