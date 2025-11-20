/**
 * useNotifications - React hook for notifications
 * @module hooks
 */

import { useState, useEffect, useCallback } from 'react';

import { notificationManager, Notification } from '../features/notifications/NotificationManager';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    return unsubscribe;
  }, []);

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

  const remove = useCallback((id: string) => {
    notificationManager.remove(id);
  }, []);

  const markAsRead = useCallback((id: string) => {
    notificationManager.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationManager.markAllAsRead();
  }, []);

  const clear = useCallback(() => {
    notificationManager.clear();
  }, []);

  const clearRead = useCallback(() => {
    notificationManager.clearRead();
  }, []);

  return {
    notifications,
    unreadCount: notificationManager.getUnreadCount(),
    unread: notificationManager.getUnread(),
    success,
    error,
    warning,
    info,
    remove,
    markAsRead,
    markAllAsRead,
    clear,
    clearRead,
  };
}
