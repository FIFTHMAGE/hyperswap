/**
 * Real-time Notification Manager
 * Handles live notifications, alerts, and user messaging
 */

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationType = 
  | 'price-alert' 
  | 'swap-complete' 
  | 'limit-order'
  | 'portfolio-change'
  | 'system'
  | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface NotificationConfig {
  maxNotifications: number;
  autoCleanOlderThan: number; // milliseconds
  enableSound: boolean;
  enableDesktop: boolean;
  enableToast: boolean;
  soundVolume: number;
  priorityFilters: NotificationPriority[];
}

const DEFAULT_CONFIG: NotificationConfig = {
  maxNotifications: 50,
  autoCleanOlderThan: 24 * 60 * 60 * 1000, // 24 hours
  enableSound: true,
  enableDesktop: true,
  enableToast: true,
  soundVolume: 0.5,
  priorityFilters: ['low', 'medium', 'high', 'urgent'],
};

export class NotificationManager {
  private notifications: Notification[] = [];
  private config: NotificationConfig;
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private audioContext?: AudioContext;

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize audio context for sounds
    if (typeof window !== 'undefined' && this.config.enableSound) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Request desktop notification permission
    if (typeof window !== 'undefined' && this.config.enableDesktop) {
      this.requestDesktopPermission();
    }

    // Auto-cleanup old notifications
    this.startAutoCleanup();
  }

  /**
   * Add a new notification
   */
  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false,
    };

    // Check priority filter
    if (!this.config.priorityFilters.includes(notification.priority)) {
      return id;
    }

    this.notifications.unshift(newNotification);

    // Enforce max notifications limit
    if (this.notifications.length > this.config.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.config.maxNotifications);
    }

    // Trigger notifications
    this.handleNewNotification(newNotification);
    this.notifyListeners();

    return id;
  }

  /**
   * Handle new notification (sound, desktop, etc.)
   */
  private handleNewNotification(notification: Notification): void {
    // Play sound
    if (this.config.enableSound) {
      this.playNotificationSound(notification.priority);
    }

    // Show desktop notification
    if (this.config.enableDesktop) {
      this.showDesktopNotification(notification);
    }
  }

  /**
   * Play notification sound based on priority
   */
  private playNotificationSound(priority: NotificationPriority): void {
    if (!this.audioContext) return;

    const frequencies: Record<NotificationPriority, number> = {
      low: 400,
      medium: 600,
      high: 800,
      urgent: 1000,
    };

    const frequency = frequencies[priority];
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.config.soundVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Show desktop notification
   */
  private async showDesktopNotification(notification: Notification): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      const n = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
      });

      n.onclick = () => {
        if (notification.actionUrl) {
          window.open(notification.actionUrl, '_blank');
        }
        n.close();
      };
    }
  }

  /**
   * Request desktop notification permission
   */
  private async requestDesktopPermission(): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => (n.read = true));
    this.notifyListeners();
  }

  /**
   * Remove notification
   */
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
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
    return this.notifications.filter(n => !n.read);
  }

  /**
   * Get notifications by type
   */
  getByType(type: NotificationType): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  /**
   * Get notifications by priority
   */
  getByPriority(priority: NotificationPriority): Notification[] {
    return this.notifications.filter(n => n.priority === priority);
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
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
    this.listeners.forEach(listener => listener(this.notifications));
  }

  /**
   * Start auto-cleanup of old notifications
   */
  private startAutoCleanup(): void {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      const now = Date.now();
      this.notifications = this.notifications.filter(
        n => now - n.timestamp < this.config.autoCleanOlderThan
      );
      this.notifyListeners();
    }, 60000); // Check every minute
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.getUnread().length;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      total: this.notifications.length,
      unread: this.getUnreadCount(),
      byType: {
        'price-alert': this.getByType('price-alert').length,
        'swap-complete': this.getByType('swap-complete').length,
        'limit-order': this.getByType('limit-order').length,
        'portfolio-change': this.getByType('portfolio-change').length,
        'system': this.getByType('system').length,
        'error': this.getByType('error').length,
      },
      byPriority: {
        low: this.getByPriority('low').length,
        medium: this.getByPriority('medium').length,
        high: this.getByPriority('high').length,
        urgent: this.getByPriority('urgent').length,
      },
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.listeners.clear();
    this.notifications = [];
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Singleton instance
let notificationManager: NotificationManager | null = null;

export function getNotificationManager(config?: Partial<NotificationConfig>): NotificationManager {
  if (!notificationManager) {
    notificationManager = new NotificationManager(config);
  }
  return notificationManager;
}

