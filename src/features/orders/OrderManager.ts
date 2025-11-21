/**
 * Order Manager
 * Manages limit orders and advanced order types
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export enum OrderType {
  LIMIT = 'limit',
  STOP_LOSS = 'stop_loss',
  TAKE_PROFIT = 'take_profit',
  STOP_LIMIT = 'stop_limit',
}

export enum OrderStatus {
  PENDING = 'pending',
  PARTIALLY_FILLED = 'partially_filled',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export interface Order {
  id: string;
  type: OrderType;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  limitPrice: string;
  stopPrice?: string;
  filledAmount: string;
  status: OrderStatus;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userAddress: string;
  slippageTolerance: number;
}

const STORAGE_KEY = 'hyperswap_orders';
const MAX_ORDERS = 100;

export class OrderManager {
  private static instance: OrderManager;
  private orders: Order[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(orders: Order[]) => void> = new Set();
  private priceCheckInterval: NodeJS.Timeout | null = null;

  private constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
    this.loadOrders();
    logger.info('OrderManager initialized.');
  }

  public static getInstance(storageManager: StorageManager): OrderManager {
    if (!OrderManager.instance) {
      OrderManager.instance = new OrderManager(storageManager);
    }
    return OrderManager.instance;
  }

  private loadOrders(): void {
    try {
      const stored = this.storageManager.get<Order[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.orders = stored
          .map((o) => ({
            ...o,
            createdAt: new Date(o.createdAt),
            updatedAt: new Date(o.updatedAt),
            expiresAt: o.expiresAt ? new Date(o.expiresAt) : undefined,
          }))
          .filter(
            (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PARTIALLY_FILLED
          );
      }
    } catch (error) {
      logger.error('Failed to load orders from storage:', error);
    }
  }

  private saveOrders(): void {
    try {
      const ordersToSave = this.orders.slice(-MAX_ORDERS);
      this.storageManager.set(STORAGE_KEY, ordersToSave);
      logger.debug('Orders saved to storage.');
    } catch (error) {
      logger.error('Failed to save orders to storage:', error);
    }
  }

  /**
   * Create a new order
   */
  createOrder(
    type: OrderType,
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    limitPrice: string,
    options: {
      stopPrice?: string;
      expiresIn?: number; // minutes
      slippageTolerance?: number;
    } = {}
  ): string {
    const orderId = crypto.randomUUID();
    const now = new Date();

    const order: Order = {
      id: orderId,
      type,
      tokenIn,
      tokenOut,
      amountIn,
      amountOut: this.calculateAmountOut(amountIn, limitPrice),
      limitPrice,
      stopPrice: options.stopPrice,
      filledAmount: '0',
      status: OrderStatus.PENDING,
      expiresAt: options.expiresIn
        ? new Date(now.getTime() + options.expiresIn * 60000)
        : undefined,
      createdAt: now,
      updatedAt: now,
      userAddress: '', // Should be set from wallet context
      slippageTolerance: options.slippageTolerance || 0.5,
    };

    this.orders.unshift(order);
    this.orders = this.orders.slice(0, MAX_ORDERS);
    this.saveOrders();
    this.notifyListeners();

    logger.info(`Order created: ${orderId} (${type})`);
    return orderId;
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string): boolean {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      logger.warn(`Order ${orderId} not found`);
      return false;
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PARTIALLY_FILLED) {
      logger.warn(`Cannot cancel order ${orderId} with status ${order.status}`);
      return false;
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedAt = new Date();
    this.saveOrders();
    this.notifyListeners();

    logger.info(`Order cancelled: ${orderId}`);
    return true;
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: OrderStatus, filledAmount?: string): boolean {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      return false;
    }

    order.status = status;
    order.updatedAt = new Date();

    if (filledAmount) {
      order.filledAmount = filledAmount;
    }

    this.saveOrders();
    this.notifyListeners();

    logger.info(`Order ${orderId} updated to ${status}`);
    return true;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.find((o) => o.id === orderId);
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
    return this.orders.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PARTIALLY_FILLED
    );
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders.filter((o) => o.status === status);
  }

  /**
   * Get orders by token pair
   */
  getOrdersByPair(tokenIn: string, tokenOut: string): Order[] {
    return this.orders.filter(
      (o) =>
        o.tokenIn.toLowerCase() === tokenIn.toLowerCase() &&
        o.tokenOut.toLowerCase() === tokenOut.toLowerCase()
    );
  }

  /**
   * Check orders against current price
   */
  async checkOrders(currentPrices: Record<string, string>): Promise<void> {
    const activeOrders = this.getActiveOrders();
    const now = new Date();

    for (const order of activeOrders) {
      // Check expiration
      if (order.expiresAt && now > order.expiresAt) {
        this.updateOrderStatus(order.id, OrderStatus.EXPIRED);
        continue;
      }

      // Get current price for the pair
      const pairKey = `${order.tokenIn}-${order.tokenOut}`;
      const currentPrice = currentPrices[pairKey];

      if (!currentPrice) {
        continue;
      }

      // Check if order should be executed
      if (this.shouldExecuteOrder(order, currentPrice)) {
        await this.executeOrder(order);
      }
    }
  }

  /**
   * Determine if order should be executed
   */
  private shouldExecuteOrder(order: Order, currentPrice: string): boolean {
    const price = parseFloat(currentPrice);
    const limitPrice = parseFloat(order.limitPrice);
    const stopPrice = order.stopPrice ? parseFloat(order.stopPrice) : null;

    switch (order.type) {
      case OrderType.LIMIT:
        // Buy when price <= limit, sell when price >= limit
        return price <= limitPrice;

      case OrderType.STOP_LOSS:
        // Trigger when price drops below stop price
        return stopPrice !== null && price <= stopPrice;

      case OrderType.TAKE_PROFIT:
        // Trigger when price reaches target
        return price >= limitPrice;

      case OrderType.STOP_LIMIT:
        // First check stop price, then limit price
        if (stopPrice !== null && price <= stopPrice) {
          return price >= limitPrice;
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Execute an order
   */
  private async executeOrder(order: Order): Promise<void> {
    try {
      logger.info(`Executing order: ${order.id}`);

      // This would integrate with actual swap execution
      // For now, just mark as filled
      this.updateOrderStatus(order.id, OrderStatus.FILLED, order.amountIn);

      // Emit notification
      // notificationCenter.add('success', 'Order Filled', `Your ${order.type} order has been executed`);
    } catch (error) {
      logger.error(`Failed to execute order ${order.id}:`, error);
    }
  }

  /**
   * Calculate expected output amount
   */
  private calculateAmountOut(amountIn: string, price: string): string {
    try {
      const amount = parseFloat(amountIn);
      const priceNum = parseFloat(price);
      return (amount / priceNum).toFixed(6);
    } catch {
      return '0';
    }
  }

  /**
   * Start price monitoring
   */
  startMonitoring(
    priceProvider: () => Promise<Record<string, string>>,
    intervalMs: number = 10000
  ): void {
    if (this.priceCheckInterval) {
      logger.warn('Price monitoring already running');
      return;
    }

    this.priceCheckInterval = setInterval(async () => {
      try {
        const prices = await priceProvider();
        await this.checkOrders(prices);
      } catch (error) {
        logger.error('Error checking orders:', error);
      }
    }, intervalMs);

    logger.info(`Order monitoring started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop price monitoring
   */
  stopMonitoring(): void {
    if (this.priceCheckInterval) {
      clearInterval(this.priceCheckInterval);
      this.priceCheckInterval = null;
      logger.info('Order monitoring stopped');
    }
  }

  /**
   * Subscribe to order updates
   */
  subscribe(callback: (orders: Order[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
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
   * Clear completed orders
   */
  clearCompleted(): void {
    this.orders = this.orders.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PARTIALLY_FILLED
    );
    this.saveOrders();
    this.notifyListeners();
    logger.info('Completed orders cleared');
  }

  /**
   * Get order statistics
   */
  getStatistics(): {
    total: number;
    active: number;
    filled: number;
    cancelled: number;
    expired: number;
    byType: Record<OrderType, number>;
  } {
    const stats = {
      total: this.orders.length,
      active: 0,
      filled: 0,
      cancelled: 0,
      expired: 0,
      byType: {
        [OrderType.LIMIT]: 0,
        [OrderType.STOP_LOSS]: 0,
        [OrderType.TAKE_PROFIT]: 0,
        [OrderType.STOP_LIMIT]: 0,
      },
    };

    this.orders.forEach((order) => {
      if (order.status === OrderStatus.PENDING || order.status === OrderStatus.PARTIALLY_FILLED) {
        stats.active++;
      } else if (order.status === OrderStatus.FILLED) {
        stats.filled++;
      } else if (order.status === OrderStatus.CANCELLED) {
        stats.cancelled++;
      } else if (order.status === OrderStatus.EXPIRED) {
        stats.expired++;
      }

      stats.byType[order.type]++;
    });

    return stats;
  }
}

// Singleton instance
export const orderManager = OrderManager.getInstance(StorageManager.getInstance());
