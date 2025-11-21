/**
 * Price Alert Manager
 * Handles price alerts and notifications
 */

import logger from '../../utils/logger';
import { notificationCenter } from '../notifications/NotificationCenter';
import { StorageManager } from '../storage/StorageManager';

export type AlertCondition = 'above' | 'below' | 'crosses';
export type AlertStatus = 'active' | 'triggered' | 'expired' | 'cancelled';

export interface PriceAlert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  condition: AlertCondition;
  targetPrice: string;
  currentPrice?: string;
  status: AlertStatus;
  createdAt: Date;
  triggeredAt?: Date;
  expiresAt?: Date;
  notified: boolean;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'price_alerts';
const MAX_ALERTS = 100;

export class PriceAlertManager {
  private alerts: PriceAlert[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(alerts: PriceAlert[]) => void> = new Set();
  private monitoringInterval?: NodeJS.Timer;

  constructor() {
    this.storageManager = new StorageManager();
    this.loadAlerts();
  }

  /**
   * Load alerts from storage
   */
  private loadAlerts(): void {
    try {
      const stored = this.storageManager.get<PriceAlert[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.alerts = stored
          .map((alert) => ({
            ...alert,
            createdAt: new Date(alert.createdAt),
            triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
            expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
          }))
          .filter((alert) => alert.status === 'active');
      }
    } catch (error) {
      logger.error('Error loading price alerts:', error);
    }
  }

  /**
   * Save alerts to storage
   */
  private saveAlerts(): void {
    try {
      const toStore = this.alerts.slice(0, MAX_ALERTS);
      this.storageManager.set(STORAGE_KEY, toStore);
    } catch (error) {
      logger.error('Error saving price alerts:', error);
    }
  }

  /**
   * Create a price alert
   */
  createAlert(
    tokenAddress: string,
    tokenSymbol: string,
    condition: AlertCondition,
    targetPrice: string,
    expiresIn?: number
  ): string {
    const alert: PriceAlert = {
      id: this.generateId(),
      tokenAddress: tokenAddress.toLowerCase(),
      tokenSymbol,
      condition,
      targetPrice,
      status: 'active',
      createdAt: new Date(),
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : undefined,
      notified: false,
    };

    this.alerts.unshift(alert);
    this.saveAlerts();
    this.notifyListeners();

    return alert.id;
  }

  /**
   * Check alert condition
   */
  checkAlert(alert: PriceAlert, currentPrice: string): boolean {
    if (alert.status !== 'active') return false;

    // Check expiration
    if (alert.expiresAt && new Date() > alert.expiresAt) {
      alert.status = 'expired';
      this.saveAlerts();
      return false;
    }

    const current = parseFloat(currentPrice);
    const target = parseFloat(alert.targetPrice);

    switch (alert.condition) {
      case 'above':
        return current >= target;

      case 'below':
        return current <= target;

      case 'crosses':
        // Check if price crossed the target
        if (!alert.currentPrice) {
          alert.currentPrice = currentPrice;
          return false;
        }
        const previous = parseFloat(alert.currentPrice);
        alert.currentPrice = currentPrice;

        // Crossed from below
        if (previous < target && current >= target) return true;
        // Crossed from above
        if (previous > target && current <= target) return true;

        return false;

      default:
        return false;
    }
  }

  /**
   * Trigger an alert
   */
  triggerAlert(alertId: string, currentPrice: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return;

    alert.status = 'triggered';
    alert.triggeredAt = new Date();
    alert.currentPrice = currentPrice;

    // Send notification if not already notified
    if (!alert.notified) {
      this.sendNotification(alert, currentPrice);
      alert.notified = true;
    }

    this.saveAlerts();
    this.notifyListeners();
  }

  /**
   * Send notification for triggered alert
   */
  private sendNotification(alert: PriceAlert, currentPrice: string): void {
    let message = '';

    switch (alert.condition) {
      case 'above':
        message = `${alert.tokenSymbol} is now above $${alert.targetPrice}! Current price: $${currentPrice}`;
        break;
      case 'below':
        message = `${alert.tokenSymbol} is now below $${alert.targetPrice}! Current price: $${currentPrice}`;
        break;
      case 'crosses':
        message = `${alert.tokenSymbol} crossed $${alert.targetPrice}! Current price: $${currentPrice}`;
        break;
    }

    notificationCenter.success('Price Alert Triggered', message, {
      persistent: true,
      metadata: {
        alertId: alert.id,
        tokenAddress: alert.tokenAddress,
      },
    });

    // Also show browser notification if available
    notificationCenter.showBrowserNotification(`Price Alert: ${alert.tokenSymbol}`, {
      body: message,
      icon: '/icons/alert.png',
    });
  }

  /**
   * Cancel an alert
   */
  cancelAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert && alert.status === 'active') {
      alert.status = 'cancelled';
      this.saveAlerts();
      this.notifyListeners();
    }
  }

  /**
   * Get alert by ID
   */
  getAlert(alertId: string): PriceAlert | undefined {
    return this.alerts.find((a) => a.id === alertId);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): PriceAlert[] {
    return [...this.alerts];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PriceAlert[] {
    return this.alerts.filter((a) => a.status === 'active');
  }

  /**
   * Get alerts for a token
   */
  getTokenAlerts(tokenAddress: string): PriceAlert[] {
    return this.alerts.filter((a) => a.tokenAddress.toLowerCase() === tokenAddress.toLowerCase());
  }

  /**
   * Get alerts by status
   */
  getAlertsByStatus(status: AlertStatus): PriceAlert[] {
    return this.alerts.filter((a) => a.status === status);
  }

  /**
   * Check all active alerts
   */
  async checkAlerts(
    getPriceFunc: (tokenAddress: string) => Promise<string>
  ): Promise<PriceAlert[]> {
    const activeAlerts = this.getActiveAlerts();
    const triggeredAlerts: PriceAlert[] = [];

    for (const alert of activeAlerts) {
      try {
        const currentPrice = await getPriceFunc(alert.tokenAddress);

        if (this.checkAlert(alert, currentPrice)) {
          this.triggerAlert(alert.id, currentPrice);
          triggeredAlerts.push(alert);
        }
      } catch (error) {
        logger.error(`Error checking alert ${alert.id}:`, error);
      }
    }

    return triggeredAlerts;
  }

  /**
   * Start monitoring alerts
   */
  startMonitoring(
    getPriceFunc: (tokenAddress: string) => Promise<string>,
    intervalMs: number = 60000
  ): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.monitoringInterval = setInterval(async () => {
      await this.checkAlerts(getPriceFunc);
    }, intervalMs);

    logger.info('Price alert monitoring started');
  }

  /**
   * Stop monitoring alerts
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      logger.info('Price alert monitoring stopped');
    }
  }

  /**
   * Clear old alerts
   */
  clearOldAlerts(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.alerts = this.alerts.filter(
      (alert) =>
        alert.status === 'active' ||
        (alert.triggeredAt && alert.triggeredAt > cutoffDate) ||
        alert.createdAt > cutoffDate
    );

    this.saveAlerts();
    this.notifyListeners();
  }

  /**
   * Get alert statistics
   */
  getStats(): {
    total: number;
    active: number;
    triggered: number;
    expired: number;
    cancelled: number;
    byToken: Record<string, number>;
  } {
    const byToken: Record<string, number> = {};
    let active = 0;
    let triggered = 0;
    let expired = 0;
    let cancelled = 0;

    this.alerts.forEach((alert) => {
      const token = alert.tokenSymbol;
      byToken[token] = (byToken[token] || 0) + 1;

      switch (alert.status) {
        case 'active':
          active++;
          break;
        case 'triggered':
          triggered++;
          break;
        case 'expired':
          expired++;
          break;
        case 'cancelled':
          cancelled++;
          break;
      }
    });

    return {
      total: this.alerts.length,
      active,
      triggered,
      expired,
      cancelled,
      byToken,
    };
  }

  /**
   * Subscribe to alert changes
   */
  subscribe(callback: (alerts: PriceAlert[]) => void): () => void {
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
        callback(this.getAllAlerts());
      } catch (error) {
        logger.error('Error notifying alert listener:', error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Export alerts
   */
  export(): string {
    return JSON.stringify(this.alerts, null, 2);
  }

  /**
   * Import alerts
   */
  import(data: string): void {
    try {
      const imported = JSON.parse(data) as PriceAlert[];
      if (Array.isArray(imported)) {
        this.alerts = imported.map((alert) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
          triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
          expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
        }));
        this.saveAlerts();
        this.notifyListeners();
      }
    } catch (error) {
      logger.error('Error importing alerts:', error);
      throw new Error('Failed to import alerts');
    }
  }

  /**
   * Clear all alerts
   */
  clearAll(): void {
    this.alerts = [];
    this.saveAlerts();
    this.notifyListeners();
  }
}

// Singleton instance
export const priceAlertManager = new PriceAlertManager();
