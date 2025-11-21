/**
 * Notification Center
 * Centralized notification management system
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'transaction';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface NotificationOptions {
  persistent?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  autoClose?: number;
}

const STORAGE_KEY = 'notifications';
const MAX_NOTIFICATIONS = 100;

export class NotificationCenter {
  private notifications: Notification[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private unreadCount: number = 0;

  constructor() {
    this.storageManager = new StorageManager();
    this.loadNotifications();
  }

  /**
   * Load notifications from storage
   */
  private loadNotifications(): void {
    try {
      const stored = this.storageManager.get<Notification[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.notifications = stored.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        this.updateUnreadCount();
      }
    } catch (error) {
      logger.error('Error loading notifications:', error);
    }
  }

  /**
   * Save notifications to storage
   */
  private saveNotifications(): void {
    try {
      // Keep only recent notifications
      const toStore = this.notifications.slice(0, MAX_NOTIFICATIONS);
      this.storageManager.set(STORAGE_KEY, toStore);
    } catch (error) {
      logger.error('Error saving notifications:', error);
    }
  }

  /**
   * Add a new notification
   */
  add(
    type: NotificationType,
    title: string,
    message: string,
    options: NotificationOptions = {}
  ): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      persistent: options.persistent ?? false,
      actionUrl: options.actionUrl,
      actionLabel: options.actionLabel,
      metadata: options.metadata,
    };

    this.notifications.unshift(notification);
    this.updateUnreadCount();
    this.saveNotifications();
    this.notifyListeners();

    // Auto-close non-persistent notifications
    if (!notification.persistent && options.autoClose) {
      setTimeout(() => this.remove(notification.id), options.autoClose);
    }

    return notification.id;
  }

  /**
   * Add success notification
   */
  success(title: string, message: string, options?: NotificationOptions): string {
    return this.add('success', title, message, options);
  }

  /**
   * Add error notification
   */
  error(title: string, message: string, options?: NotificationOptions): string {
    return this.add('error', title, message, { persistent: true, ...options });
  }

  /**
   * Add warning notification
   */
  warning(title: string, message: string, options?: NotificationOptions): string {
    return this.add('warning', title, message, options);
  }

  /**
   * Add info notification
   */
  info(title: string, message: string, options?: NotificationOptions): string {
    return this.add('info', title, message, options);
  }

  /**
   * Add transaction notification
   */
  transaction(
    title: string,
    message: string,
    txHash: string,
    options?: NotificationOptions
  ): string {
    return this.add('transaction', title, message, {
      ...options,
      persistent: true,
      metadata: { txHash, ...(options?.metadata || {}) },
    });
  }

  /**
   * Remove a notification
   */
  remove(id: string): void {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.updateUnreadCount();
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification && !notification.read) {
      notification.read = true;
      this.updateUnreadCount();
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    let changed = false;
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true;
        changed = true;
      }
    });

    if (changed) {
      this.updateUnreadCount();
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  /**
   * Get all notifications
   */
  getAll(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications
   */
  getUnread(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  /**
   * Get notifications by type
   */
  getByType(type: NotificationType): Notification[] {
    return this.notifications.filter((n) => n.type === type);
  }

  /**
   * Get notification by ID
   */
  getById(id: string): Notification | undefined {
    return this.notifications.find((n) => n.id === id);
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.unreadCount;
  }

  /**
   * Update unread count
   */
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
    this.unreadCount = 0;
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Clear read notifications
   */
  clearRead(): void {
    this.notifications = this.notifications.filter((n) => !n.read);
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Clear old notifications
   */
  clearOld(daysOld: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.notifications = this.notifications.filter(
      (n) => n.persistent || new Date(n.timestamp) > cutoffDate
    );

    this.updateUnreadCount();
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
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
        callback(this.getAll());
      } catch (error) {
        logger.error('Error notifying notification listener:', error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      logger.warn('Browser notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  /**
   * Show browser notification
   */
  async showBrowserNotification(
    title: string,
    options: NotificationOptions & { body?: string; icon?: string } = {}
  ): Promise<void> {
    const permission = await this.requestPermission();

    if (permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body: options.body,
          icon: options.icon || '/logo.png',
          badge: '/badge.png',
          tag: this.generateId(),
        });

        notification.onclick = () => {
          if (options.actionUrl) {
            window.open(options.actionUrl, '_blank');
          }
          notification.close();
        };
      } catch (error) {
        logger.error('Error showing browser notification:', error);
      }
    }
  }

  /**
   * Get notification statistics
   */
  getStats(): {
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
  } {
    const byType: Record<string, number> = {
      success: 0,
      error: 0,
      warning: 0,
      info: 0,
      transaction: 0,
    };

    this.notifications.forEach((n) => {
      byType[n.type] = (byType[n.type] || 0) + 1;
    });

    return {
      total: this.notifications.length,
      unread: this.unreadCount,
      byType: byType as Record<NotificationType, number>,
    };
  }

  /**
   * Export notifications
   */
  export(): string {
    return JSON.stringify(this.notifications, null, 2);
  }

  /**
   * Import notifications
   */
  import(data: string): void {
    try {
      const imported = JSON.parse(data) as Notification[];
      if (Array.isArray(imported)) {
        this.notifications = imported.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        this.updateUnreadCount();
        this.saveNotifications();
        this.notifyListeners();
      }
    } catch (error) {
      logger.error('Error importing notifications:', error);
      throw new Error('Failed to import notifications');
    }
  }
}

// Singleton instance
export const notificationCenter = new NotificationCenter();
