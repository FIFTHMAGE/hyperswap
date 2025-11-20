/**
 * NotificationSystem - Global notification system component
 * @module components/notifications
 */

import React, { useState, useCallback, useEffect } from 'react';

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
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  timestamp: number;
}

interface NotificationSystemProps {
  maxNotifications?: number;
  defaultDuration?: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

// Global notification manager
class NotificationManager {
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private notifications: Notification[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    listener(this.notifications);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  add(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      dismissible: notification.dismissible !== false,
    };

    this.notifications.push(newNotification);
    this.notify();

    // Auto-dismiss if duration is set
    if (notification.duration) {
      const timer = setTimeout(() => {
        this.remove(id);
      }, notification.duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  remove(id: string) {
    // Clear timer if exists
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear() {
    // Clear all timers
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();

    this.notifications = [];
    this.notify();
  }

  success(title: string, message: string, duration?: number) {
    return this.add({ type: NotificationType.SUCCESS, title, message, duration });
  }

  error(title: string, message: string, duration?: number) {
    return this.add({ type: NotificationType.ERROR, title, message, duration });
  }

  warning(title: string, message: string, duration?: number) {
    return this.add({ type: NotificationType.WARNING, title, message, duration });
  }

  info(title: string, message: string, duration?: number) {
    return this.add({ type: NotificationType.INFO, title, message, duration });
  }
}

export const notificationManager = new NotificationManager();

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  maxNotifications = 5,
  defaultDuration: _defaultDuration = 5000,
  position = 'top-right',
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  const handleDismiss = useCallback((id: string) => {
    notificationManager.remove(id);
  }, []);

  const visibleNotifications = notifications.slice(-maxNotifications);

  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-3 max-w-sm w-full`}>
      {visibleNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Match animation duration
  }, [notification.id, onDismiss]);

  const typeStyles: Record<NotificationType, { bg: string; border: string; icon: string }> = {
    [NotificationType.SUCCESS]: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: '✓',
    },
    [NotificationType.ERROR]: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: '✕',
    },
    [NotificationType.WARNING]: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: '⚠',
    },
    [NotificationType.INFO]: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'ℹ',
    },
  };

  const style = typeStyles[notification.type];

  return (
    <div
      className={`
        ${style.bg} ${style.border}
        border rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-sm">
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>

          {/* Action button */}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {notification.dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Helper hook for using notifications
export function useNotifications() {
  const success = useCallback((title: string, message: string, duration?: number) => {
    return notificationManager.success(title, message, duration);
  }, []);

  const error = useCallback((title: string, message: string, duration?: number) => {
    return notificationManager.error(title, message, duration);
  }, []);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    return notificationManager.warning(title, message, duration);
  }, []);

  const info = useCallback((title: string, message: string, duration?: number) => {
    return notificationManager.info(title, message, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    notificationManager.remove(id);
  }, []);

  const clear = useCallback(() => {
    notificationManager.clear();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
  };
}
