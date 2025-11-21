/**
 * Price Alert Manager
 * Manages price alerts and notifications for tokens
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export enum AlertCondition {
  ABOVE = 'above',
  BELOW = 'below',
  PERCENT_CHANGE = 'percent_change',
}

export enum AlertStatus {
  ACTIVE = 'active',
  TRIGGERED = 'triggered',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface PriceAlert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  condition: AlertCondition;
  targetPrice?: string;
  percentChange?: number;
  basePrice?: string;
  status: AlertStatus;
  createdAt: Date;
  triggeredAt?: Date;
  expiresAt?: Date;
  notified: boolean;
  repeat: boolean;
}

const STORAGE_KEY = 'hyperswap_price_alerts';
const MAX_ALERTS = 100;

export class PriceAlertManager {
  private static instance: PriceAlertManager;
  private alerts: Map<string, PriceAlert> = new Map();
  private storageManager: StorageManager;
  private listeners: Set<(alert: PriceAlert) => void> = new Set();
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
    this.loadAlerts();
    logger.info('PriceAlertManager initialized.');
  }

  public static getInstance(storageManager: StorageManager): PriceAlertManager {
    if (!PriceAlertManager.instance) {
      PriceAlertManager.instance = new PriceAlertManager(storageManager);
    }
    return PriceAlertManager.instance;
  }

  private loadAlerts(): void {
    try {
      const stored = this.storageManager.get<PriceAlert[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        stored
          .filter((alert) => alert.status === AlertStatus.ACTIVE)
          .forEach((alert) => {
            this.alerts.set(alert.id, {
              ...alert,
              createdAt: new Date(alert.createdAt),
              triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
              expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
            });
          });
      }
    } catch (error) {
      logger.error('Failed to load price alerts from storage:', error);
    }
  }

  private saveAlerts(): void {
    try {
      const alertsArray = Array.from(this.alerts.values()).slice(-MAX_ALERTS);
      this.storageManager.set(STORAGE_KEY, alertsArray);
      logger.debug('Price alerts saved to storage.');
    } catch (error) {
      logger.error('Failed to save price alerts to storage:', error);
    }
  }

  /**
   * Create a price alert
   */
  createAlert(
    tokenAddress: string,
    tokenSymbol: string,
    condition: AlertCondition,
    options: {
      targetPrice?: string;
      percentChange?: number;
      basePrice?: string;
      expiresIn?: number; // hours
      repeat?: boolean;
    } = {}
  ): string {
    if (this.alerts.size >= MAX_ALERTS) {
      throw new Error('Maximum number of alerts reached');
    }

    // Validate inputs
    if (condition === AlertCondition.ABOVE || condition === AlertCondition.BELOW) {
      if (!options.targetPrice) {
        throw new Error('Target price is required for above/below alerts');
      }
    } else if (condition === AlertCondition.PERCENT_CHANGE) {
      if (!options.percentChange || !options.basePrice) {
        throw new Error('Percent change and base price are required');
      }
    }

    const id = crypto.randomUUID();
    const now = new Date();

    const alert: PriceAlert = {
      id,
      tokenAddress: tokenAddress.toLowerCase(),
      tokenSymbol,
      condition,
      targetPrice: options.targetPrice,
      percentChange: options.percentChange,
      basePrice: options.basePrice,
      status: AlertStatus.ACTIVE,
      createdAt: now,
      expiresAt: options.expiresIn
        ? new Date(now.getTime() + options.expiresIn * 60 * 60 * 1000)
        : undefined,
      notified: false,
      repeat: options.repeat || false,
    };

    this.alerts.set(id, alert);
    this.saveAlerts();

    logger.info(`Price alert created: ${id} for ${tokenSymbol}`);
    return id;
  }

  /**
   * Cancel an alert
   */
  cancelAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);

    if (!alert) {
      return false;
    }

    alert.status = AlertStatus.CANCELLED;
    this.alerts.delete(alertId);
    this.saveAlerts();

    logger.info(`Price alert cancelled: ${alertId}`);
    return true;
  }

  /**
   * Check alerts against current prices
   */
  async checkAlerts(currentPrices: Record<string, string>): Promise<void> {
    const now = new Date();
    const triggeredAlerts: PriceAlert[] = [];

    for (const alert of this.alerts.values()) {
      // Check expiration
      if (alert.expiresAt && now > alert.expiresAt) {
        alert.status = AlertStatus.EXPIRED;
        this.alerts.delete(alert.id);
        continue;
      }

      const currentPrice = currentPrices[alert.tokenAddress];
      if (!currentPrice) {
        continue;
      }

      const price = parseFloat(currentPrice);

      // Check if alert condition is met
      let triggered = false;

      switch (alert.condition) {
        case AlertCondition.ABOVE:
          if (alert.targetPrice && price >= parseFloat(alert.targetPrice)) {
            triggered = true;
          }
          break;

        case AlertCondition.BELOW:
          if (alert.targetPrice && price <= parseFloat(alert.targetPrice)) {
            triggered = true;
          }
          break;

        case AlertCondition.PERCENT_CHANGE:
          if (alert.percentChange && alert.basePrice) {
            const basePrice = parseFloat(alert.basePrice);
            const change = ((price - basePrice) / basePrice) * 100;

            if (Math.abs(change) >= Math.abs(alert.percentChange)) {
              triggered = true;
            }
          }
          break;
      }

      if (triggered) {
        alert.status = AlertStatus.TRIGGERED;
        alert.triggeredAt = now;
        alert.notified = false;
        triggeredAlerts.push(alert);

        if (!alert.repeat) {
          this.alerts.delete(alert.id);
        } else {
          // Reset for repeating alerts
          if (alert.condition === AlertCondition.PERCENT_CHANGE) {
            alert.basePrice = currentPrice;
          }
          alert.notified = false;
        }

        logger.info(`Price alert triggered: ${alert.id} for ${alert.tokenSymbol}`);
      }
    }

    if (triggeredAlerts.length > 0) {
      this.saveAlerts();
      triggeredAlerts.forEach((alert) => {
        this.notifyListeners(alert);
      });
    }
  }

  /**
   * Get alert by ID
   */
  getAlert(alertId: string): PriceAlert | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values()).filter((alert) => alert.status === AlertStatus.ACTIVE);
  }

  /**
   * Get alerts for a specific token
   */
  getTokenAlerts(tokenAddress: string): PriceAlert[] {
    const lowerAddress = tokenAddress.toLowerCase();
    return this.getActiveAlerts().filter((alert) => alert.tokenAddress === lowerAddress);
  }

  /**
   * Get alerts by condition
   */
  getAlertsByCondition(condition: AlertCondition): PriceAlert[] {
    return this.getActiveAlerts().filter((alert) => alert.condition === condition);
  }

  /**
   * Update alert
   */
  updateAlert(
    alertId: string,
    updates: {
      targetPrice?: string;
      percentChange?: number;
      expiresAt?: Date;
      repeat?: boolean;
    }
  ): boolean {
    const alert = this.alerts.get(alertId);

    if (!alert) {
      return false;
    }

    if (updates.targetPrice !== undefined) {
      alert.targetPrice = updates.targetPrice;
    }

    if (updates.percentChange !== undefined) {
      alert.percentChange = updates.percentChange;
    }

    if (updates.expiresAt !== undefined) {
      alert.expiresAt = updates.expiresAt;
    }

    if (updates.repeat !== undefined) {
      alert.repeat = updates.repeat;
    }

    this.saveAlerts();
    logger.info(`Price alert updated: ${alertId}`);
    return true;
  }

  /**
   * Mark alert as notified
   */
  markNotified(alertId: string): boolean {
    const alert = this.alerts.get(alertId);

    if (!alert) {
      return false;
    }

    alert.notified = true;
    this.saveAlerts();
    return true;
  }

  /**
   * Start monitoring prices
   */
  startMonitoring(
    priceProvider: () => Promise<Record<string, string>>,
    intervalMs: number = 10000
  ): void {
    if (this.checkInterval) {
      logger.warn('Price monitoring already running');
      return;
    }

    this.checkInterval = setInterval(async () => {
      try {
        const prices = await priceProvider();
        await this.checkAlerts(prices);
      } catch (error) {
        logger.error('Error checking price alerts:', error);
      }
    }, intervalMs);

    logger.info(`Price alert monitoring started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Price alert monitoring stopped');
    }
  }

  /**
   * Subscribe to alert triggers
   */
  subscribe(callback: (alert: PriceAlert) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(alert: PriceAlert): void {
    this.listeners.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        logger.error('Error notifying alert listener:', error);
      }
    });
  }

  /**
   * Clear expired alerts
   */
  clearExpired(): number {
    const now = new Date();
    let cleared = 0;

    for (const [id, alert] of this.alerts.entries()) {
      if (alert.expiresAt && now > alert.expiresAt) {
        this.alerts.delete(id);
        cleared++;
      }
    }

    if (cleared > 0) {
      this.saveAlerts();
      logger.info(`Cleared ${cleared} expired alerts`);
    }

    return cleared;
  }

  /**
   * Clear all alerts
   */
  clearAll(): void {
    this.alerts.clear();
    this.saveAlerts();
    logger.info('All price alerts cleared');
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    total: number;
    active: number;
    byCondition: Record<AlertCondition, number>;
    byToken: Record<string, number>;
    repeating: number;
    expiring24h: number;
  } {
    const stats = {
      total: this.alerts.size,
      active: 0,
      byCondition: {
        [AlertCondition.ABOVE]: 0,
        [AlertCondition.BELOW]: 0,
        [AlertCondition.PERCENT_CHANGE]: 0,
      },
      byToken: {} as Record<string, number>,
      repeating: 0,
      expiring24h: 0,
    };

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    this.alerts.forEach((alert) => {
      if (alert.status === AlertStatus.ACTIVE) {
        stats.active++;
      }

      stats.byCondition[alert.condition]++;

      const tokenKey = alert.tokenSymbol;
      stats.byToken[tokenKey] = (stats.byToken[tokenKey] || 0) + 1;

      if (alert.repeat) {
        stats.repeating++;
      }

      if (alert.expiresAt && alert.expiresAt <= tomorrow) {
        stats.expiring24h++;
      }
    });

    return stats;
  }

  /**
   * Export alerts
   */
  exportAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Import alerts
   */
  importAlerts(alerts: PriceAlert[]): void {
    alerts.forEach((alert) => {
      if (!this.alerts.has(alert.id) && this.alerts.size < MAX_ALERTS) {
        this.alerts.set(alert.id, {
          ...alert,
          createdAt: new Date(alert.createdAt),
          triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
          expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
        });
      }
    });

    this.saveAlerts();
    logger.info('Price alerts imported successfully');
  }
}

// Singleton instance
export const priceAlertManager = PriceAlertManager.getInstance(StorageManager.getInstance());
