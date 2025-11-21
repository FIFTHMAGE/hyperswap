/**
 * Order Manager
 * Handles limit orders, stop-loss, and advanced order types
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export type OrderType = 'limit' | 'stop_loss' | 'take_profit' | 'trailing_stop';
export type OrderStatus = 'pending' | 'active' | 'filled' | 'cancelled' | 'expired';

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  targetPrice: string;
  stopPrice?: string;
  trailingPercent?: number;
  slippage: number;
  deadline: number;
  createdAt: Date;
  expiresAt?: Date;
  filledAt?: Date;
  txHash?: string;
  metadata?: Record<string, unknown>;
}

interface OrderExecutionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  filledPrice?: string;
}

const STORAGE_KEY = 'orders';
const MAX_ORDERS = 500;

export class OrderManager {
  private orders: Order[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(orders: Order[]) => void> = new Set();
  private priceCheckInterval?: NodeJS.Timer;

  constructor() {
    this.storageManager = new StorageManager();
    this.loadOrders();
  }

  /**
   * Load orders from storage
   */
  private loadOrders(): void {
    try {
      const stored = this.storageManager.get<Order[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.orders = stored
          .map((o) => ({
            ...o,
            createdAt: new Date(o.createdAt),
            expiresAt: o.expiresAt ? new Date(o.expiresAt) : undefined,
            filledAt: o.filledAt ? new Date(o.filledAt) : undefined,
          }))
          .filter((o) => o.status === 'pending' || o.status === 'active');
      }
    } catch (error) {
      logger.error('Error loading orders:', error);
    }
  }

  /**
   * Save orders to storage
   */
  private saveOrders(): void {
    try {
      const toStore = this.orders.slice(0, MAX_ORDERS);
      this.storageManager.set(STORAGE_KEY, toStore);
    } catch (error) {
      logger.error('Error saving orders:', error);
    }
  }

  /**
   * Create a new limit order
   */
  createLimitOrder(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    targetPrice: string,
    slippage: number = 0.5,
    deadline: number = 20,
    expiresIn?: number
  ): string {
    const order: Order = {
      id: this.generateId(),
      type: 'limit',
      status: 'pending',
      tokenIn,
      tokenOut,
      amountIn,
      targetPrice,
      slippage,
      deadline,
      createdAt: new Date(),
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : undefined,
    };

    this.orders.unshift(order);
    this.saveOrders();
    this.notifyListeners();

    return order.id;
  }

  /**
   * Create a stop-loss order
   */
  createStopLoss(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    stopPrice: string,
    slippage: number = 1.0
  ): string {
    const order: Order = {
      id: this.generateId(),
      type: 'stop_loss',
      status: 'pending',
      tokenIn,
      tokenOut,
      amountIn,
      targetPrice: stopPrice,
      stopPrice,
      slippage,
      deadline: 20,
      createdAt: new Date(),
    };

    this.orders.unshift(order);
    this.saveOrders();
    this.notifyListeners();

    return order.id;
  }

  /**
   * Create a take-profit order
   */
  createTakeProfit(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    targetPrice: string,
    slippage: number = 0.5
  ): string {
    const order: Order = {
      id: this.generateId(),
      type: 'take_profit',
      status: 'pending',
      tokenIn,
      tokenOut,
      amountIn,
      targetPrice,
      slippage,
      deadline: 20,
      createdAt: new Date(),
    };

    this.orders.unshift(order);
    this.saveOrders();
    this.notifyListeners();

    return order.id;
  }

  /**
   * Create a trailing stop order
   */
  createTrailingStop(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    trailingPercent: number,
    slippage: number = 1.0
  ): string {
    const order: Order = {
      id: this.generateId(),
      type: 'trailing_stop',
      status: 'pending',
      tokenIn,
      tokenOut,
      amountIn,
      targetPrice: '0', // Will be calculated dynamically
      trailingPercent,
      slippage,
      deadline: 20,
      createdAt: new Date(),
    };

    this.orders.unshift(order);
    this.saveOrders();
    this.notifyListeners();

    return order.id;
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order && (order.status === 'pending' || order.status === 'active')) {
      order.status = 'cancelled';
      this.saveOrders();
      this.notifyListeners();
    }
  }

  /**
   * Get all orders
   */
  getAllOrders(): Order[] {
    return [...this.orders];
  }

  /**
   * Get active orders
   */
  getActiveOrders(): Order[] {
    return this.orders.filter((o) => o.status === 'pending' || o.status === 'active');
  }

  /**
   * Get orders by type
   */
  getOrdersByType(type: OrderType): Order[] {
    return this.orders.filter((o) => o.type === type);
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.find((o) => o.id === orderId);
  }

  /**
   * Check if order should be executed based on current price
   */
  shouldExecuteOrder(order: Order, currentPrice: string): boolean {
    if (order.status !== 'pending' && order.status !== 'active') {
      return false;
    }

    // Check expiration
    if (order.expiresAt && new Date() > order.expiresAt) {
      order.status = 'expired';
      this.saveOrders();
      this.notifyListeners();
      return false;
    }

    const current = parseFloat(currentPrice);
    const target = parseFloat(order.targetPrice);

    switch (order.type) {
      case 'limit':
        // Execute when current price reaches or exceeds target
        return current >= target;

      case 'stop_loss':
        // Execute when current price drops to or below stop price
        return current <= target;

      case 'take_profit':
        // Execute when current price reaches or exceeds target
        return current >= target;

      case 'trailing_stop':
        // Complex logic - would track highest price and trigger based on trailing %
        return this.checkTrailingStop(order, current);

      default:
        return false;
    }
  }

  /**
   * Check trailing stop conditions
   */
  private checkTrailingStop(order: Order, currentPrice: number): boolean {
    if (!order.metadata?.highestPrice) {
      // Initialize highest price
      order.metadata = { ...order.metadata, highestPrice: currentPrice };
      return false;
    }

    const highestPrice = order.metadata.highestPrice;
    const trailingPercent = order.trailingPercent || 5;

    // Update highest price if current is higher
    if (currentPrice > highestPrice) {
      order.metadata.highestPrice = currentPrice;
      return false;
    }

    // Check if price dropped below trailing percentage
    const dropPercent = ((highestPrice - currentPrice) / highestPrice) * 100;
    return dropPercent >= trailingPercent;
  }

  /**
   * Execute an order
   */
  async executeOrder(
    orderId: string,
    currentPrice: string,
    executeSwap: (order: Order) => Promise<string>
  ): Promise<OrderExecutionResult> {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (!this.shouldExecuteOrder(order, currentPrice)) {
      return { success: false, error: 'Order conditions not met' };
    }

    try {
      order.status = 'active';
      this.notifyListeners();

      // Execute the swap
      const txHash = await executeSwap(order);

      order.status = 'filled';
      order.filledAt = new Date();
      order.txHash = txHash;

      this.saveOrders();
      this.notifyListeners();

      return {
        success: true,
        txHash,
        filledPrice: currentPrice,
      };
    } catch (error) {
      logger.error(`Error executing order ${orderId}:`, error);
      order.status = 'pending'; // Revert to pending
      this.notifyListeners();

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
      };
    }
  }

  /**
   * Start monitoring orders
   */
  startMonitoring(
    getPriceFunc: (tokenIn: string, tokenOut: string) => Promise<string>,
    executeSwapFunc: (order: Order) => Promise<string>,
    intervalMs: number = 60000
  ): void {
    if (this.priceCheckInterval) {
      this.stopMonitoring();
    }

    this.priceCheckInterval = setInterval(async () => {
      const activeOrders = this.getActiveOrders();

      for (const order of activeOrders) {
        try {
          const currentPrice = await getPriceFunc(order.tokenIn, order.tokenOut);

          if (this.shouldExecuteOrder(order, currentPrice)) {
            await this.executeOrder(order.id, currentPrice, executeSwapFunc);
          }
        } catch (error) {
          logger.error(`Error checking order ${order.id}:`, error);
        }
      }
    }, intervalMs);

    logger.info('Order monitoring started');
  }

  /**
   * Stop monitoring orders
   */
  stopMonitoring(): void {
    if (this.priceCheckInterval) {
      clearInterval(this.priceCheckInterval);
      this.priceCheckInterval = undefined;
      logger.info('Order monitoring stopped');
    }
  }

  /**
   * Subscribe to order changes
   */
  subscribe(callback: (orders: Order[]) => void): () => void {
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
        callback(this.getAllOrders());
      } catch (error) {
        logger.error('Error notifying order listener:', error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get order statistics
   */
  getStats(): {
    total: number;
    active: number;
    filled: number;
    cancelled: number;
    expired: number;
    byType: Record<OrderType, number>;
  } {
    const byType: Record<string, number> = {
      limit: 0,
      stop_loss: 0,
      take_profit: 0,
      trailing_stop: 0,
    };

    let active = 0;
    let filled = 0;
    let cancelled = 0;
    let expired = 0;

    this.orders.forEach((order) => {
      byType[order.type]++;

      switch (order.status) {
        case 'active':
        case 'pending':
          active++;
          break;
        case 'filled':
          filled++;
          break;
        case 'cancelled':
          cancelled++;
          break;
        case 'expired':
          expired++;
          break;
      }
    });

    return {
      total: this.orders.length,
      active,
      filled,
      cancelled,
      expired,
      byType: byType as Record<OrderType, number>,
    };
  }

  /**
   * Clear filled and cancelled orders
   */
  clearHistory(): void {
    this.orders = this.orders.filter((o) => o.status === 'pending' || o.status === 'active');
    this.saveOrders();
    this.notifyListeners();
  }

  /**
   * Export orders
   */
  export(): string {
    return JSON.stringify(this.orders, null, 2);
  }

  /**
   * Import orders
   */
  import(data: string): void {
    try {
      const imported = JSON.parse(data) as Order[];
      if (Array.isArray(imported)) {
        this.orders = imported.map((o) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          expiresAt: o.expiresAt ? new Date(o.expiresAt) : undefined,
          filledAt: o.filledAt ? new Date(o.filledAt) : undefined,
        }));
        this.saveOrders();
        this.notifyListeners();
      }
    } catch (error) {
      logger.error('Error importing orders:', error);
      throw new Error('Failed to import orders');
    }
  }
}

// Singleton instance
export const orderManager = new OrderManager();
