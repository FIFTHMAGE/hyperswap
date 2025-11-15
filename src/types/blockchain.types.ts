/**
 * Blockchain-related type definitions
 * @module blockchain.types
 */

/** Ethereum-style address */
export type Address = `0x${string}`;

/** Transaction or block hash */
export type Hash = `0x${string}`;

/** Blockchain chain identifier */
export type ChainId = number;

/** Block number or tag */
export type BlockNumber = number | 'latest' | 'pending' | 'earliest' | 'finalized' | 'safe';

/** Transaction type (EIP-2718) */
export type TransactionType = 0 | 1 | 2; // Legacy, EIP-2930, EIP-1559

/** Network types */
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

/** Chain category */
export type ChainCategory = 'ethereum' | 'layer2' | 'sidechain' | 'bitcoin' | 'solana' | 'other';

/**
 * Comprehensive chain configuration
 */
export interface Chain {
  id: ChainId;
  name: string;
  shortName: string;
  networkType: NetworkType;
  category: ChainCategory;
  nativeCurrency: NativeCurrency;
  rpcUrls: RpcConfig[];
  blockExplorerUrls: BlockExplorer[];
  testnet: boolean;
  enabled: boolean;
  icon?: string;
  features: ChainFeatures;
  contracts?: ChainContracts;
}

/**
 * Native currency information
 */
export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
}

/**
 * RPC endpoint configuration
 */
export interface RpcConfig {
  url: string;
  priority: number;
  authentication?: {
    type: 'apiKey' | 'bearer';
    key: string;
  };
  rateLimit?: number;
  timeout?: number;
}

/**
 * Block explorer information
 */
export interface BlockExplorer {
  name: string;
  url: string;
  apiUrl?: string;
  apiKey?: string;
}

/**
 * Chain features and capabilities
 */
export interface ChainFeatures {
  supportsEIP1559: boolean;
  supportsEIP2930: boolean;
  supportsMulticall: boolean;
  supportsENS: boolean;
  multicallAddress?: Address;
  ensRegistryAddress?: Address;
  averageBlockTime: number;
  finality: 'instant' | 'probabilistic' | 'absolute';
  finalityBlocks?: number;
}

/**
 * Common contract addresses for the chain
 */
export interface ChainContracts {
  multicall?: Address;
  multicall3?: Address;
  ensRegistry?: Address;
  ensUniversalResolver?: Address;
  wrappedNative?: Address;
}

/**
 * Enhanced token interface with metadata
 */
export interface Token {
  address: Address;
  chainId: ChainId;
  decimals: number;
  symbol: string;
  name: string;
  logoURI?: string;
  tags?: TokenTag[];
  extensions?: TokenExtensions;
  verified?: boolean;
  listed?: boolean;
  priceUSD?: number;
  marketCap?: string;
}

/**
 * Token tags for categorization
 */
export type TokenTag =
  | 'stablecoin'
  | 'wrapped'
  | 'governance'
  | 'defi'
  | 'nft'
  | 'gaming'
  | 'meme'
  | 'bridged';

/**
 * Token extensions for additional metadata
 */
export interface TokenExtensions {
  coingeckoId?: string;
  coinmarketcapId?: string;
  bridgeInfo?: Record<ChainId, BridgeInfo>;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

/**
 * Bridge information for cross-chain tokens
 */
export interface BridgeInfo {
  tokenAddress: Address;
  originChainId: ChainId;
  bridge: string;
}

/**
 * Token amount with formatting
 */
export interface TokenAmount {
  token: Token;
  amount: string;
  formatted: string;
  decimals: number;
  valueUSD?: string;
}

/**
 * Comprehensive transaction structure
 */
export interface Transaction {
  hash: Hash;
  from: Address;
  to: Address | null;
  value: string;
  data: string;
  nonce: number;
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  chainId: ChainId;
  type: TransactionType;
  accessList?: AccessListEntry[];
  blockNumber?: BlockNumber;
  blockHash?: Hash;
  timestamp?: number;
  transactionIndex?: number;
}

/**
 * EIP-2930 Access list entry
 */
export interface AccessListEntry {
  address: Address;
  storageKeys: Hash[];
}

/**
 * Transaction receipt with detailed status
 */
export interface TransactionReceipt {
  transactionHash: Hash;
  blockNumber: BlockNumber;
  blockHash: Hash;
  from: Address;
  to: Address | null;
  contractAddress?: Address;
  status: TransactionStatus;
  gasUsed: string;
  effectiveGasPrice: string;
  cumulativeGasUsed: string;
  logs: Log[];
  logsBloom: string;
  type: TransactionType;
}

/**
 * Transaction status
 */
export type TransactionStatus = 'success' | 'failed' | 'pending' | 'dropped' | 'replaced';

/**
 * Event log entry
 */
export interface Log {
  address: Address;
  topics: Hash[];
  data: string;
  blockNumber: BlockNumber;
  blockHash: Hash;
  transactionHash: Hash;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
}

/**
 * Block information
 */
export interface Block {
  number: BlockNumber;
  hash: Hash;
  parentHash: Hash;
  timestamp: number;
  transactions: Hash[];
  miner: Address;
  difficulty: string;
  totalDifficulty: string;
  size: number;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas?: string;
  extraData: string;
  nonce?: string;
}

/**
 * Gas estimation result
 */
export interface GasEstimate {
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedCost: string;
  estimatedCostUSD?: string;
}

/**
 * Gas price information
 */
export interface GasPrice {
  slow: GasPriceLevel;
  standard: GasPriceLevel;
  fast: GasPriceLevel;
  instant: GasPriceLevel;
  timestamp: number;
}

/**
 * Gas price for specific priority level
 */
export interface GasPriceLevel {
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedTime: number;
}

/**
 * Balance information
 */
export interface Balance {
  address: Address;
  balance: string;
  formatted: string;
  decimals: number;
  symbol: string;
  valueUSD?: string;
}

/**
 * Smart contract information
 */
export interface Contract {
  address: Address;
  chainId: ChainId;
  name?: string;
  verified: boolean;
  abi?: unknown[];
  implementation?: Address;
  proxy: boolean;
}

/** Type guard for valid Ethereum address */
export function isAddress(value: unknown): value is Address {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{40}$/.test(value);
}

/** Type guard for valid transaction hash */
export function isHash(value: unknown): value is Hash {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{64}$/.test(value);
}

/** Type guard for native token (zero address) */
export function isNativeToken(token: Token): boolean {
  return token.address === '0x0000000000000000000000000000000000000000';
}
