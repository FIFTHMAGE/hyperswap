/**
 * NotificationManager - Notification state management
 * @module features/notifications
 */

import { Logger } from '../../utils/logger';

const logger = new Logger('NotificationManager');

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
  read?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type NotificationListener = (notifications: Notification[]) => void;

export class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private nextId: number = 1;

  /**
   * Add notification
   */
  add(
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
    action?: { label: string; onClick: () => void }
  ): string {
    const notification: Notification = {
      id: `notification_${this.nextId++}`,
      type,
      title,
      message,
      duration,
      timestamp: Date.now(),
      read: false,
      action,
    };

    this.notifications.unshift(notification);
    this.notifyListeners();
    logger.info(`Notification added: ${notification.id}`);

    // Auto remove after duration
    if (duration) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }

    return notification.id;
  }

  /**
   * Add success notification
   */
  success(title: string, message: string, duration: number = 5000): string {
    return this.add(NotificationType.SUCCESS, title, message, duration);
  }

  /**
   * Add error notification
   */
  error(title: string, message: string, duration?: number): string {
    return this.add(NotificationType.ERROR, title, message, duration);
  }

  /**
   * Add warning notification
   */
  warning(title: string, message: string, duration: number = 7000): string {
    return this.add(NotificationType.WARNING, title, message, duration);
  }

  /**
   * Add info notification
   */
  info(title: string, message: string, duration: number = 5000): string {
    return this.add(NotificationType.INFO, title, message, duration);
  }

  /**
   * Remove notification
   */
  remove(id: string): void {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.notifyListeners();
      logger.info(`Notification removed: ${id}`);
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => {
      n.read = true;
    });
    this.notifyListeners();
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
    logger.info('All notifications cleared');
  }

  /**
   * Clear read notifications
   */
  clearRead(): void {
    this.notifications = this.notifications.filter((n) => !n.read);
    this.notifyListeners();
    logger.info('Read notifications cleared');
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
   * Get unread count
   */
  getUnreadCount(): number {
    return this.getUnread().length;
  }

  /**
   * Get notification by ID
   */
  getById(id: string): Notification | undefined {
    return this.notifications.find((n) => n.id === id);
  }

  /**
   * Subscribe to notifications
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.notifications); // Initial call
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener([...this.notifications]);
    });
  }
}

export const notificationManager = new NotificationManager();
