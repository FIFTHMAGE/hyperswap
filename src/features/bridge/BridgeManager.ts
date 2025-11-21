/**
 * Bridge Manager
 * Handles cross-chain token bridging operations
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export enum BridgeStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface SupportedChain {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  bridgeContractAddress: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface BridgeTransaction {
  id: string;
  sourceChain: number;
  destinationChain: number;
  token: string;
  amount: string;
  sender: string;
  recipient: string;
  status: BridgeStatus;
  sourceTxHash?: string;
  destinationTxHash?: string;
  estimatedTime: number; // minutes
  fee: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const STORAGE_KEY = 'hyperswap_bridge_transactions';
const MAX_TRANSACTIONS = 50;

const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    bridgeContractAddress: '0x0000000000000000000000000000000000000001',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    bridgeContractAddress: '0x0000000000000000000000000000000000000002',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  {
    chainId: 56,
    name: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    bridgeContractAddress: '0x0000000000000000000000000000000000000003',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    bridgeContractAddress: '0x0000000000000000000000000000000000000004',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    bridgeContractAddress: '0x0000000000000000000000000000000000000005',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
];

export class BridgeManager {
  private static instance: BridgeManager;
  private transactions: BridgeTransaction[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(transactions: BridgeTransaction[]) => void> = new Set();
  private statusCheckInterval: NodeJS.Timeout | null = null;

  private constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
    this.loadTransactions();
    logger.info('BridgeManager initialized.');
  }

  public static getInstance(storageManager: StorageManager): BridgeManager {
    if (!BridgeManager.instance) {
      BridgeManager.instance = new BridgeManager(storageManager);
    }
    return BridgeManager.instance;
  }

  private loadTransactions(): void {
    try {
      const stored = this.storageManager.get<BridgeTransaction[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.transactions = stored.map((tx) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          completedAt: tx.completedAt ? new Date(tx.completedAt) : undefined,
        }));
      }
    } catch (error) {
      logger.error('Failed to load bridge transactions from storage:', error);
    }
  }

  private saveTransactions(): void {
    try {
      const txToSave = this.transactions.slice(-MAX_TRANSACTIONS);
      this.storageManager.set(STORAGE_KEY, txToSave);
      logger.debug('Bridge transactions saved to storage.');
    } catch (error) {
      logger.error('Failed to save bridge transactions to storage:', error);
    }
  }

  /**
   * Get supported chains
   */
  getSupportedChains(): SupportedChain[] {
    return [...SUPPORTED_CHAINS];
  }

  /**
   * Get chain by ID
   */
  getChainById(chainId: number): SupportedChain | undefined {
    return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId);
  }

  /**
   * Check if chain is supported
   */
  isChainSupported(chainId: number): boolean {
    return SUPPORTED_CHAINS.some((chain) => chain.chainId === chainId);
  }

  /**
   * Calculate bridge fee
   */
  calculateBridgeFee(sourceChain: number, destinationChain: number, amount: string): string {
    // Base fee: 0.1% of amount
    const baseFee = parseFloat(amount) * 0.001;

    // Chain-specific fees
    let chainFee = 0;
    if (sourceChain === 1) chainFee += 0.005; // Ethereum is more expensive
    if (destinationChain === 1) chainFee += 0.005;

    const totalFee = baseFee + chainFee;
    return totalFee.toFixed(6);
  }

  /**
   * Estimate bridge time
   */
  estimateBridgeTime(sourceChain: number, destinationChain: number): number {
    // Base time: 10 minutes
    let time = 10;

    // Ethereum takes longer
    if (sourceChain === 1) time += 5;
    if (destinationChain === 1) time += 5;

    // Fast chains
    if ([137, 42161, 10].includes(sourceChain)) time -= 3;
    if ([137, 42161, 10].includes(destinationChain)) time -= 3;

    return Math.max(time, 3); // Minimum 3 minutes
  }

  /**
   * Initiate bridge transaction
   */
  async initiateBridge(
    sourceChain: number,
    destinationChain: number,
    token: string,
    amount: string,
    sender: string,
    recipient: string
  ): Promise<string> {
    if (!this.isChainSupported(sourceChain)) {
      throw new Error(`Source chain ${sourceChain} is not supported`);
    }

    if (!this.isChainSupported(destinationChain)) {
      throw new Error(`Destination chain ${destinationChain} is not supported`);
    }

    if (sourceChain === destinationChain) {
      throw new Error('Source and destination chains must be different');
    }

    const fee = this.calculateBridgeFee(sourceChain, destinationChain, amount);
    const estimatedTime = this.estimateBridgeTime(sourceChain, destinationChain);

    const txId = crypto.randomUUID();
    const now = new Date();

    const transaction: BridgeTransaction = {
      id: txId,
      sourceChain,
      destinationChain,
      token,
      amount,
      sender,
      recipient,
      status: BridgeStatus.PENDING,
      estimatedTime,
      fee,
      createdAt: now,
      updatedAt: now,
    };

    this.transactions.unshift(transaction);
    this.transactions = this.transactions.slice(0, MAX_TRANSACTIONS);
    this.saveTransactions();
    this.notifyListeners();

    logger.info(`Bridge transaction initiated: ${txId} (${sourceChain} -> ${destinationChain})`);

    return txId;
  }

  /**
   * Update transaction status
   */
  updateTransaction(
    txId: string,
    updates: {
      status?: BridgeStatus;
      sourceTxHash?: string;
      destinationTxHash?: string;
      completedAt?: Date;
    }
  ): boolean {
    const transaction = this.transactions.find((tx) => tx.id === txId);

    if (!transaction) {
      logger.warn(`Bridge transaction ${txId} not found`);
      return false;
    }

    if (updates.status) {
      transaction.status = updates.status;
    }

    if (updates.sourceTxHash) {
      transaction.sourceTxHash = updates.sourceTxHash;
    }

    if (updates.destinationTxHash) {
      transaction.destinationTxHash = updates.destinationTxHash;
    }

    if (updates.completedAt) {
      transaction.completedAt = updates.completedAt;
    }

    transaction.updatedAt = new Date();
    this.saveTransactions();
    this.notifyListeners();

    logger.info(`Bridge transaction ${txId} updated to ${updates.status || 'unknown'}`);
    return true;
  }

  /**
   * Get transaction by ID
   */
  getTransaction(txId: string): BridgeTransaction | undefined {
    return this.transactions.find((tx) => tx.id === txId);
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): BridgeTransaction[] {
    return [...this.transactions];
  }

  /**
   * Get active transactions
   */
  getActiveTransactions(): BridgeTransaction[] {
    return this.transactions.filter(
      (tx) => tx.status === BridgeStatus.PENDING || tx.status === BridgeStatus.PROCESSING
    );
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: BridgeStatus): BridgeTransaction[] {
    return this.transactions.filter((tx) => tx.status === status);
  }

  /**
   * Get transactions by address
   */
  getTransactionsByAddress(address: string): BridgeTransaction[] {
    const lowerAddress = address.toLowerCase();
    return this.transactions.filter(
      (tx) =>
        tx.sender.toLowerCase() === lowerAddress || tx.recipient.toLowerCase() === lowerAddress
    );
  }

  /**
   * Get transactions by chain
   */
  getTransactionsByChain(
    chainId: number,
    type: 'source' | 'destination' | 'any' = 'any'
  ): BridgeTransaction[] {
    if (type === 'source') {
      return this.transactions.filter((tx) => tx.sourceChain === chainId);
    } else if (type === 'destination') {
      return this.transactions.filter((tx) => tx.destinationChain === chainId);
    } else {
      return this.transactions.filter(
        (tx) => tx.sourceChain === chainId || tx.destinationChain === chainId
      );
    }
  }

  /**
   * Check transaction status on blockchain
   */
  async checkTransactionStatus(txId: string): Promise<void> {
    const transaction = this.getTransaction(txId);

    if (!transaction) {
      return;
    }

    // Placeholder for actual blockchain status check
    // In production, this would query the bridge contract
    if (transaction.status === BridgeStatus.PENDING && transaction.sourceTxHash) {
      this.updateTransaction(txId, { status: BridgeStatus.PROCESSING });
    } else if (transaction.status === BridgeStatus.PROCESSING) {
      // Check if enough time has passed
      const now = new Date();
      const elapsedMinutes = (now.getTime() - transaction.createdAt.getTime()) / (1000 * 60);

      if (elapsedMinutes >= transaction.estimatedTime) {
        this.updateTransaction(txId, {
          status: BridgeStatus.COMPLETED,
          completedAt: now,
          destinationTxHash: '0x' + '1'.repeat(64), // Placeholder
        });
      }
    }
  }

  /**
   * Start monitoring active transactions
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.statusCheckInterval) {
      logger.warn('Bridge monitoring already running');
      return;
    }

    this.statusCheckInterval = setInterval(async () => {
      const active = this.getActiveTransactions();
      for (const tx of active) {
        try {
          await this.checkTransactionStatus(tx.id);
        } catch (error) {
          logger.error(`Error checking bridge transaction ${tx.id}:`, error);
        }
      }
    }, intervalMs);

    logger.info(`Bridge monitoring started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
      logger.info('Bridge monitoring stopped');
    }
  }

  /**
   * Subscribe to transaction updates
   */
  subscribe(callback: (transactions: BridgeTransaction[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.getAllTransactions());
      } catch (error) {
        logger.error('Error notifying bridge listener:', error);
      }
    });
  }

  /**
   * Clear completed transactions
   */
  clearCompleted(daysOld: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.transactions = this.transactions.filter(
      (tx) => tx.status !== BridgeStatus.COMPLETED || !tx.completedAt || tx.completedAt > cutoffDate
    );

    this.saveTransactions();
    this.notifyListeners();
    logger.info(`Cleared completed transactions older than ${daysOld} days`);
  }

  /**
   * Get bridge statistics
   */
  getStatistics(): {
    total: number;
    active: number;
    completed: number;
    failed: number;
    totalVolume: string;
    totalFees: string;
    byChain: Record<number, { sent: number; received: number }>;
  } {
    const stats = {
      total: this.transactions.length,
      active: 0,
      completed: 0,
      failed: 0,
      totalVolume: '0',
      totalFees: '0',
      byChain: {} as Record<number, { sent: number; received: number }>,
    };

    let volume = 0;
    let fees = 0;

    this.transactions.forEach((tx) => {
      if (tx.status === BridgeStatus.PENDING || tx.status === BridgeStatus.PROCESSING) {
        stats.active++;
      } else if (tx.status === BridgeStatus.COMPLETED) {
        stats.completed++;
      } else if (tx.status === BridgeStatus.FAILED) {
        stats.failed++;
      }

      volume += parseFloat(tx.amount);
      fees += parseFloat(tx.fee);

      // By chain
      if (!stats.byChain[tx.sourceChain]) {
        stats.byChain[tx.sourceChain] = { sent: 0, received: 0 };
      }
      if (!stats.byChain[tx.destinationChain]) {
        stats.byChain[tx.destinationChain] = { sent: 0, received: 0 };
      }

      stats.byChain[tx.sourceChain].sent++;
      stats.byChain[tx.destinationChain].received++;
    });

    stats.totalVolume = volume.toFixed(6);
    stats.totalFees = fees.toFixed(6);

    return stats;
  }
}

// Singleton instance
export const bridgeManager = BridgeManager.getInstance(StorageManager.getInstance());
