/**
 * Portfolio transaction history types
 * @module types/portfolio/transaction
 */

import type { Address, ChainId, TxHash, TransactionType } from '../blockchain';
import type { Token } from '../token';

/**
 * Portfolio transaction
 */
export interface PortfolioTransaction {
  hash: TxHash;
  chainId: ChainId;
  from: Address;
  to: Address;
  type: TransactionType;
  status: 'success' | 'failed' | 'pending';
  value: string;
  valueUSD: number;
  gasUsed: string;
  gasCostUSD: number;
  timestamp: number;
  blockNumber: number;
  tokens: PortfolioTransactionToken[];
  method?: string;
  description: string;
}

/**
 * Token involved in transaction
 */
export interface PortfolioTransactionToken {
  token: Token;
  amount: string;
  amountUSD: number;
  direction: 'in' | 'out';
}

/**
 * Transaction summary/stats
 */
export interface TransactionSummary {
  totalTransactions: number;
  totalVolumeUSD: number;
  totalGasSpentUSD: number;
  successRate: number;
  averageGasPrice: string;
  mostActiveChain: ChainId;
  topTokens: Array<{
    token: Token;
    transactionCount: number;
    volumeUSD: number;
  }>;
}

/**
 * Transaction filters
 */
export interface TransactionFilters {
  chainId?: ChainId;
  type?: TransactionType;
  status?: 'success' | 'failed' | 'pending';
  token?: Address;
  fromDate?: number;
  toDate?: number;
  minValue?: number;
  maxValue?: number;
}

