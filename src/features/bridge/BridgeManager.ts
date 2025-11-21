/**
 * Bridge Manager
 * Handles cross-chain token transfers and bridge operations
 */

import { ethers } from 'ethers';

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface BridgeRoute {
  id: string;
  name: string;
  fromChain: number;
  toChain: number;
  token: string;
  minAmount: string;
  maxAmount: string;
  estimatedTime: number; // in minutes
  fee: string;
  feeType: 'fixed' | 'percentage';
  enabled: boolean;
}

export interface BridgeTransaction {
  id: string;
  route: BridgeRoute;
  amount: string;
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sourceTxHash?: string;
  destinationTxHash?: string;
  createdAt: Date;
  completedAt?: Date;
  estimatedArrival?: Date;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'bridge_transactions';
const MAX_TRANSACTIONS = 500;

export class BridgeManager {
  private routes: Map<string, BridgeRoute> = new Map();
  private transactions: BridgeTransaction[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(transactions: BridgeTransaction[]) => void> = new Set();

  constructor() {
    this.storageManager = new StorageManager();
    this.loadTransactions();
    this.initializeRoutes();
  }

  /**
   * Initialize bridge routes
   */
  private initializeRoutes(): void {
    // Example routes - in production these would come from an API
    const routes: BridgeRoute[] = [
      {
        id: 'eth-polygon-usdc',
        name: 'Ethereum to Polygon (USDC)',
        fromChain: 1,
        toChain: 137,
        token: 'USDC',
        minAmount: '10',
        maxAmount: '1000000',
        estimatedTime: 7,
        fee: '0.1',
        feeType: 'percentage',
        enabled: true,
      },
      {
        id: 'polygon-eth-usdc',
        name: 'Polygon to Ethereum (USDC)',
        fromChain: 137,
        toChain: 1,
        token: 'USDC',
        minAmount: '10',
        maxAmount: '1000000',
        estimatedTime: 15,
        fee: '0.1',
        feeType: 'percentage',
        enabled: true,
      },
      {
        id: 'eth-arbitrum-eth',
        name: 'Ethereum to Arbitrum (ETH)',
        fromChain: 1,
        toChain: 42161,
        token: 'ETH',
        minAmount: '0.01',
        maxAmount: '100',
        estimatedTime: 10,
        fee: '0.001',
        feeType: 'fixed',
        enabled: true,
      },
      {
        id: 'arbitrum-eth-eth',
        name: 'Arbitrum to Ethereum (ETH)',
        fromChain: 42161,
        toChain: 1,
        token: 'ETH',
        minAmount: '0.01',
        maxAmount: '100',
        estimatedTime: 420, // 7 hours due to challenge period
        fee: '0.001',
        feeType: 'fixed',
        enabled: true,
      },
    ];

    routes.forEach((route) => {
      this.routes.set(route.id, route);
    });
  }

  /**
   * Load transactions from storage
   */
  private loadTransactions(): void {
    try {
      const stored = this.storageManager.get<BridgeTransaction[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.transactions = stored.map((tx) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          completedAt: tx.completedAt ? new Date(tx.completedAt) : undefined,
          estimatedArrival: tx.estimatedArrival ? new Date(tx.estimatedArrival) : undefined,
        }));
      }
    } catch (error) {
      logger.error('Error loading bridge transactions:', error);
    }
  }

  /**
   * Save transactions to storage
   */
  private saveTransactions(): void {
    try {
      const toStore = this.transactions.slice(0, MAX_TRANSACTIONS);
      this.storageManager.set(STORAGE_KEY, toStore);
    } catch (error) {
      logger.error('Error saving bridge transactions:', error);
    }
  }

  /**
   * Get available routes
   */
  getRoutes(fromChain?: number, toChain?: number, token?: string): BridgeRoute[] {
    let routes = Array.from(this.routes.values()).filter((route) => route.enabled);

    if (fromChain !== undefined) {
      routes = routes.filter((route) => route.fromChain === fromChain);
    }

    if (toChain !== undefined) {
      routes = routes.filter((route) => route.toChain === toChain);
    }

    if (token) {
      routes = routes.filter((route) => route.token.toLowerCase() === token.toLowerCase());
    }

    return routes;
  }

  /**
   * Get route by ID
   */
  getRoute(routeId: string): BridgeRoute | undefined {
    return this.routes.get(routeId);
  }

  /**
   * Calculate bridge fee
   */
  calculateFee(routeId: string, amount: string): string {
    const route = this.routes.get(routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    const amountBN = ethers.utils.parseEther(amount);
    const feeBN =
      route.feeType === 'percentage'
        ? amountBN.mul(ethers.utils.parseEther(route.fee)).div(ethers.utils.parseEther('100'))
        : ethers.utils.parseEther(route.fee);

    return ethers.utils.formatEther(feeBN);
  }

  /**
   * Calculate amount after fees
   */
  calculateAmountAfterFee(routeId: string, amount: string): string {
    const fee = this.calculateFee(routeId, amount);
    const amountBN = ethers.utils.parseEther(amount);
    const feeBN = ethers.utils.parseEther(fee);

    return ethers.utils.formatEther(amountBN.sub(feeBN));
  }

  /**
   * Validate bridge amount
   */
  validateAmount(routeId: string, amount: string): { valid: boolean; error?: string } {
    const route = this.routes.get(routeId);
    if (!route) {
      return { valid: false, error: 'Route not found' };
    }

    const amountBN = ethers.utils.parseEther(amount);
    const minBN = ethers.utils.parseEther(route.minAmount);
    const maxBN = ethers.utils.parseEther(route.maxAmount);

    if (amountBN.lt(minBN)) {
      return { valid: false, error: `Amount below minimum (${route.minAmount})` };
    }

    if (amountBN.gt(maxBN)) {
      return { valid: false, error: `Amount above maximum (${route.maxAmount})` };
    }

    return { valid: true };
  }

  /**
   * Initiate bridge transaction
   */
  async initiateBridge(
    routeId: string,
    amount: string,
    fromAddress: string,
    toAddress: string,
    executeBridge: (route: BridgeRoute, amount: string, toAddress: string) => Promise<string>
  ): Promise<string> {
    const route = this.routes.get(routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    // Validate amount
    const validation = this.validateAmount(routeId, amount);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // Execute bridge transaction
      const sourceTxHash = await executeBridge(route, amount, toAddress);

      // Create transaction record
      const transaction: BridgeTransaction = {
        id: this.generateId(),
        route,
        amount,
        fromAddress,
        toAddress,
        status: 'pending',
        sourceTxHash,
        createdAt: new Date(),
        estimatedArrival: new Date(Date.now() + route.estimatedTime * 60 * 1000),
      };

      this.transactions.unshift(transaction);
      this.saveTransactions();
      this.notifyListeners();

      return transaction.id;
    } catch (error) {
      logger.error('Error initiating bridge:', error);
      throw error;
    }
  }

  /**
   * Update transaction status
   */
  updateTransactionStatus(
    transactionId: string,
    status: BridgeTransaction['status'],
    destinationTxHash?: string
  ): void {
    const transaction = this.transactions.find((tx) => tx.id === transactionId);
    if (!transaction) {
      logger.warn(`Transaction ${transactionId} not found`);
      return;
    }

    transaction.status = status;

    if (destinationTxHash) {
      transaction.destinationTxHash = destinationTxHash;
    }

    if (status === 'completed' || status === 'failed') {
      transaction.completedAt = new Date();
    }

    this.saveTransactions();
    this.notifyListeners();
  }

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): BridgeTransaction | undefined {
    return this.transactions.find((tx) => tx.id === transactionId);
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): BridgeTransaction[] {
    return [...this.transactions];
  }

  /**
   * Get pending transactions
   */
  getPendingTransactions(): BridgeTransaction[] {
    return this.transactions.filter((tx) => tx.status === 'pending' || tx.status === 'processing');
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: BridgeTransaction['status']): BridgeTransaction[] {
    return this.transactions.filter((tx) => tx.status === status);
  }

  /**
   * Check transaction status on blockchain
   */
  async checkTransactionStatus(
    transactionId: string,
    checkStatus: (
      sourceTxHash: string,
      route: BridgeRoute
    ) => Promise<{
      status: BridgeTransaction['status'];
      destinationTxHash?: string;
    }>
  ): Promise<void> {
    const transaction = this.transactions.find((tx) => tx.id === transactionId);
    if (!transaction || !transaction.sourceTxHash) {
      return;
    }

    try {
      const { status, destinationTxHash } = await checkStatus(
        transaction.sourceTxHash,
        transaction.route
      );
      this.updateTransactionStatus(transactionId, status, destinationTxHash);
    } catch (error) {
      logger.error(`Error checking transaction status ${transactionId}:`, error);
    }
  }

  /**
   * Monitor pending transactions
   */
  startMonitoring(
    checkStatus: (
      sourceTxHash: string,
      route: BridgeRoute
    ) => Promise<{
      status: BridgeTransaction['status'];
      destinationTxHash?: string;
    }>,
    intervalMs: number = 60000
  ): NodeJS.Timer {
    return setInterval(async () => {
      const pending = this.getPendingTransactions();

      for (const tx of pending) {
        await this.checkTransactionStatus(tx.id, checkStatus);
      }
    }, intervalMs);
  }

  /**
   * Subscribe to transaction updates
   */
  subscribe(callback: (transactions: BridgeTransaction[]) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners
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
   * Generate unique ID
   */
  private generateId(): string {
    return `bridge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get bridge statistics
   */
  getStats(): {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalVolume: string;
    byRoute: Record<string, number>;
  } {
    const byRoute: Record<string, number> = {};
    let pending = 0;
    let completed = 0;
    let failed = 0;
    let totalVolume = ethers.BigNumber.from(0);

    this.transactions.forEach((tx) => {
      const routeId = tx.route.id;
      byRoute[routeId] = (byRoute[routeId] || 0) + 1;

      switch (tx.status) {
        case 'pending':
        case 'processing':
          pending++;
          break;
        case 'completed':
          completed++;
          totalVolume = totalVolume.add(ethers.utils.parseEther(tx.amount));
          break;
        case 'failed':
          failed++;
          break;
      }
    });

    return {
      total: this.transactions.length,
      pending,
      completed,
      failed,
      totalVolume: ethers.utils.formatEther(totalVolume),
      byRoute,
    };
  }

  /**
   * Clear transaction history
   */
  clearHistory(): void {
    this.transactions = this.transactions.filter(
      (tx) => tx.status === 'pending' || tx.status === 'processing'
    );
    this.saveTransactions();
    this.notifyListeners();
  }

  /**
   * Export transactions
   */
  export(): string {
    return JSON.stringify(this.transactions, null, 2);
  }
}

// Singleton instance
export const bridgeManager = new BridgeManager();
