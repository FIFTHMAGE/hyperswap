/**
 * Blockchain-related type definitions
 */

export type Address = `0x${string}`;
export type Hash = `0x${string}`;
export type ChainId = number;
export type BlockNumber = number | 'latest' | 'pending' | 'earliest';

export interface Chain {
  id: ChainId;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  testnet: boolean;
  enabled: boolean;
}

export interface Token {
  address: Address;
  chainId: ChainId;
  decimals: number;
  symbol: string;
  name: string;
  logoURI?: string;
  tags?: string[];
  extensions?: Record<string, unknown>;
}

export interface TokenAmount {
  token: Token;
  amount: string;
  formatted: string;
  decimals: number;
}

export interface Transaction {
  hash: Hash;
  from: Address;
  to: Address;
  value: string;
  data: string;
  nonce: number;
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  chainId: ChainId;
}

export interface TransactionReceipt {
  transactionHash: Hash;
  blockNumber: BlockNumber;
  blockHash: Hash;
  from: Address;
  to: Address;
  status: 'success' | 'failed' | 'pending';
  gasUsed: string;
  logs: Log[];
}

export interface Log {
  address: Address;
  topics: Hash[];
  data: string;
  blockNumber: BlockNumber;
  transactionHash: Hash;
  logIndex: number;
}

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
}

