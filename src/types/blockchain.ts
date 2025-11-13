/**
 * Blockchain-related type definitions
 * @module types/blockchain
 */

/**
 * Supported blockchain networks
 */
export type ChainId = 1 | 137 | 42161 | 10 | 8453 | 43114;

/**
 * Chain names
 */
export type ChainName =
  | 'ethereum'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'avalanche';

/**
 * Blockchain address (EVM compatible)
 */
export type Address = `0x${string}`;

/**
 * Transaction hash
 */
export type TxHash = `0x${string}`;

/**
 * Block number or tag
 */
export type BlockTag = number | 'latest' | 'earliest' | 'pending';

/**
 * Chain information
 */
export interface Chain {
  id: ChainId;
  name: ChainName;
  displayName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: string[];
    public: string[];
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
      apiUrl?: string;
    };
  };
  testnet: boolean;
}

/**
 * Transaction status
 */
export type TransactionStatus =
  | 'pending'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
  | 'replaced';

/**
 * Transaction type
 */
export type TransactionType =
  | 'send'
  | 'receive'
  | 'swap'
  | 'approve'
  | 'mint'
  | 'burn'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'bridge'
  | 'contract_interaction'
  | 'unknown';

/**
 * Base transaction data
 */
export interface Transaction {
  hash: TxHash;
  from: Address;
  to: Address;
  value: string;
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce: number;
  data: string;
  chainId: ChainId;
  blockNumber?: number;
  blockHash?: string;
  timestamp?: number;
  status?: TransactionStatus;
  type?: TransactionType;
}

/**
 * Transaction receipt
 */
export interface TransactionReceipt {
  transactionHash: TxHash;
  transactionIndex: number;
  blockNumber: number;
  blockHash: string;
  from: Address;
  to: Address | null;
  cumulativeGasUsed: string;
  gasUsed: string;
  contractAddress: Address | null;
  logs: Log[];
  logsBloom: string;
  status: 'success' | 'reverted';
  effectiveGasPrice: string;
}

/**
 * Event log
 */
export interface Log {
  address: Address;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: TxHash;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
}

/**
 * Decoded log event
 */
export interface DecodedLog extends Log {
  eventName: string;
  args: Record<string, any>;
  signature: string;
}

/**
 * Gas estimation
 */
export interface GasEstimation {
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedCost: string;
  estimatedCostUSD?: number;
}

/**
 * Gas prices by speed
 */
export interface GasPrices {
  slow: {
    gasPrice: string;
    estimatedTime: number; // seconds
  };
  standard: {
    gasPrice: string;
    estimatedTime: number;
  };
  fast: {
    gasPrice: string;
    estimatedTime: number;
  };
  instant: {
    gasPrice: string;
    estimatedTime: number;
  };
}

/**
 * EIP-1559 gas prices
 */
export interface EIP1559GasPrices {
  slow: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    estimatedTime: number;
  };
  standard: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    estimatedTime: number;
  };
  fast: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    estimatedTime: number;
  };
  instant: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    estimatedTime: number;
  };
}

/**
 * Block information
 */
export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  nonce: string;
  difficulty: string;
  gasLimit: string;
  gasUsed: string;
  miner: Address;
  extraData: string;
  transactions: TxHash[] | Transaction[];
  baseFeePerGas?: string;
}

/**
 * Contract ABI
 */
export type ABI = Array<{
  type: 'function' | 'constructor' | 'event' | 'fallback' | 'receive';
  name?: string;
  inputs: Array<{
    name: string;
    type: string;
    indexed?: boolean;
    components?: any[];
  }>;
  outputs?: Array<{
    name: string;
    type: string;
    components?: any[];
  }>;
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  anonymous?: boolean;
}>;

/**
 * Smart contract
 */
export interface Contract {
  address: Address;
  name?: string;
  abi: ABI;
  bytecode?: string;
  deployedBytecode?: string;
  chainId: ChainId;
}

/**
 * Wallet balance
 */
export interface Balance {
  address: Address;
  balance: string;
  balanceFormatted: string;
  balanceUSD?: number;
  chainId: ChainId;
  timestamp: number;
}

/**
 * Multi-chain balance
 */
export interface MultiChainBalance {
  address: Address;
  balances: Record<ChainId, Balance>;
  totalBalanceUSD: number;
}

