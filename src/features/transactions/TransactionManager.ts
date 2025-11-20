/**
 * TransactionManager - Transaction history and management
 * @module features/transactions
 */

import { Logger } from '../../utils/logger';
import { storageManager, StorageKey } from '../storage/StorageManager';

const logger = new Logger('TransactionManager');

export enum TransactionType {
  SWAP = 'swap',
  LIQUIDITY_ADD = 'liquidity_add',
  LIQUIDITY_REMOVE = 'liquidity_remove',
  APPROVAL = 'approval',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface Transaction {
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: number;
  chainId: number;
  from: string;
  to?: string;
  value?: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  confirmations?: number;
  metadata?: {
    tokenIn?: string;
    tokenOut?: string;
    amountIn?: string;
    amountOut?: string;
    poolAddress?: string;
    lpAmount?: string;
    [key: string]: any;
  };
}

export class TransactionManager {
  private transactions: Map<string, Transaction> = new Map();
  private maxTransactions: number = 100;

  constructor() {
    this.loadTransactions();
  }

  /**
   * Add transaction
   */
  addTransaction(transaction: Transaction): void {
    this.transactions.set(transaction.hash, transaction);
    this.pruneTransactions();
    this.saveTransactions();
    logger.info(`Transaction added: ${transaction.hash}`);
  }

  /**
   * Update transaction status
   */
  updateTransaction(hash: string, updates: Partial<Transaction>): void {
    const transaction = this.transactions.get(hash);
    if (!transaction) {
      logger.warn(`Transaction not found: ${hash}`);
      return;
    }

    this.transactions.set(hash, { ...transaction, ...updates });
    this.saveTransactions();
    logger.info(`Transaction updated: ${hash}`);
  }

  /**
   * Get transaction by hash
   */
  getTransaction(hash: string): Transaction | undefined {
    return this.transactions.get(hash);
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get transactions by address
   */
  getTransactionsByAddress(address: string): Transaction[] {
    return this.getAllTransactions().filter(
      (tx) =>
        tx.from.toLowerCase() === address.toLowerCase() ||
        tx.to?.toLowerCase() === address.toLowerCase()
    );
  }

  /**
   * Get transactions by type
   */
  getTransactionsByType(type: TransactionType): Transaction[] {
    return this.getAllTransactions().filter((tx) => tx.type === type);
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: TransactionStatus): Transaction[] {
    return this.getAllTransactions().filter((tx) => tx.status === status);
  }

  /**
   * Get pending transactions
   */
  getPendingTransactions(): Transaction[] {
    return this.getTransactionsByStatus(TransactionStatus.PENDING);
  }

  /**
   * Get recent transactions
   */
  getRecentTransactions(limit: number = 10): Transaction[] {
    return this.getAllTransactions().slice(0, limit);
  }

  /**
   * Remove transaction
   */
  removeTransaction(hash: string): void {
    this.transactions.delete(hash);
    this.saveTransactions();
    logger.info(`Transaction removed: ${hash}`);
  }

  /**
   * Clear all transactions
   */
  clearTransactions(): void {
    this.transactions.clear();
    this.saveTransactions();
    logger.info('All transactions cleared');
  }

  /**
   * Clear old transactions
   */
  clearOldTransactions(olderThanDays: number = 30): void {
    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    const hashes = Array.from(this.transactions.keys());

    hashes.forEach((hash) => {
      const tx = this.transactions.get(hash);
      if (tx && tx.timestamp < cutoffTime) {
        this.transactions.delete(hash);
      }
    });

    this.saveTransactions();
    logger.info(`Cleared transactions older than ${olderThanDays} days`);
  }

  /**
   * Get transaction count
   */
  getTransactionCount(): number {
    return this.transactions.size;
  }

  /**
   * Check if transaction exists
   */
  hasTransaction(hash: string): boolean {
    return this.transactions.has(hash);
  }

  /**
   * Get transaction statistics
   */
  getStatistics(): {
    total: number;
    pending: number;
    confirmed: number;
    failed: number;
    byType: Record<TransactionType, number>;
  } {
    const all = this.getAllTransactions();
    const stats = {
      total: all.length,
      pending: 0,
      confirmed: 0,
      failed: 0,
      byType: {
        [TransactionType.SWAP]: 0,
        [TransactionType.LIQUIDITY_ADD]: 0,
        [TransactionType.LIQUIDITY_REMOVE]: 0,
        [TransactionType.APPROVAL]: 0,
        [TransactionType.TRANSFER]: 0,
      },
    };

    all.forEach((tx) => {
      if (tx.status === TransactionStatus.PENDING) stats.pending++;
      if (tx.status === TransactionStatus.CONFIRMED) stats.confirmed++;
      if (tx.status === TransactionStatus.FAILED) stats.failed++;
      stats.byType[tx.type]++;
    });

    return stats;
  }

  /**
   * Prune old transactions if exceeding max
   */
  private pruneTransactions(): void {
    if (this.transactions.size <= this.maxTransactions) return;

    const sorted = this.getAllTransactions();
    const toRemove = sorted.slice(this.maxTransactions);

    toRemove.forEach((tx) => {
      this.transactions.delete(tx.hash);
    });
  }

  /**
   * Save transactions to storage
   */
  private saveTransactions(): void {
    try {
      const txArray = this.getAllTransactions();
      storageManager.set(StorageKey.RECENT_TRANSACTIONS, txArray);
    } catch (error) {
      logger.error('Failed to save transactions:', error as Error);
    }
  }

  /**
   * Load transactions from storage
   */
  private loadTransactions(): void {
    try {
      const txArray = storageManager.get<Transaction[]>(StorageKey.RECENT_TRANSACTIONS);
      if (txArray && Array.isArray(txArray)) {
        txArray.forEach((tx) => {
          this.transactions.set(tx.hash, tx);
        });
        logger.info(`Loaded ${txArray.length} transactions from storage`);
      }
    } catch (error) {
      logger.error('Failed to load transactions:', error as Error);
    }
  }
}

export const transactionManager = new TransactionManager();
