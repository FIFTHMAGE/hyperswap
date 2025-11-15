/**
 * Notification Center Component
 * Displays and manages real-time notifications
 */

'use client';

import { useState, useEffect } from 'react';
import { getNotificationManager, Notification, NotificationPriority } from '@/lib/realtime/notification-manager';

interface NotificationCenterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
  autoHideDelay?: number;
  compact?: boolean;
}

export function NotificationCenter({ 
  position = 'top-right',
  maxVisible = 5,
  autoHideDelay = 5000,
  compact = false 
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const manager = getNotificationManager();

  useEffect(() => {
    const unsubscribe = manager.subscribe((notifs) => {
      setNotifications(notifs);
      setStats(manager.getStats());
    });

    return unsubscribe;
  }, [manager]);

  const handleMarkAsRead = (id: string) => {
    manager.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    manager.markAllAsRead();
  };

  const handleRemove = (id: string) => {
    manager.remove(id);
  };

  const handleClearAll = () => {
    manager.clear();
  };

  const getPriorityColor = (priority: NotificationPriority): string => {
    const colors = {
      low: 'bg-gray-100 border-gray-300',
      medium: 'bg-blue-50 border-blue-300',
      high: 'bg-yellow-50 border-yellow-400',
      urgent: 'bg-red-50 border-red-400',
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: NotificationPriority): string => {
    const icons = {
      low: 'ℹ️',
      medium: '📢',
      high: '⚠️',
      urgent: '🚨',
    };
    return icons[priority];
  };

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'price-alert': '💰',
      'swap-complete': '✅',
      'limit-order': '📊',
      'portfolio-change': '📈',
      'system': '⚙️',
      'error': '❌',
    };
    return icons[type] || '📬';
  };

  const getPositionClasses = (): string => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
    };
    return positions[position];
  };

  const formatTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const unreadCount = stats?.unread || 0;
  const recentNotifications = notifications.slice(0, maxVisible);

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute top-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {stats && (
              <div className="text-sm text-gray-600">
                {stats.total} total • {stats.unread} unread
              </div>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <div>No notifications</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 hover:bg-gray-50 transition-colors cursor-pointer
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.actionLabel || 'View'}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleClearAll}
                className="w-full py-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toast Notifications (Recent & Unread) */}
      {!isOpen && (
        <div className="absolute top-16 right-0 space-y-2">
          {recentNotifications
            .filter(n => !n.read)
            .slice(0, 3)
            .map((notification) => (
              <div
                key={notification.id}
                className={`
                  w-80 rounded-lg shadow-lg border-2 p-4
                  ${getPriorityColor(notification.priority)}
                  animate-slide-in
                `}
                style={{
                  animation: 'slideIn 0.3s ease-out',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

