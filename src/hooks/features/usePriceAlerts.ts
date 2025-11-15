/**
 * Custom hook for managing price alerts
 */

import { useState, useEffect } from 'react';
import { PriceAlert, Notification } from '@/lib/types/alerts';

const ALERTS_KEY = 'hyperswap_alerts';
const NOTIFICATIONS_KEY = 'hyperswap_notifications';

export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadAlerts();
    loadNotifications();
    startPriceMonitoring();
  }, []);

  const loadAlerts = () => {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveAlerts = (newAlerts: PriceAlert[]) => {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(newAlerts));
      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error saving alerts:', error);
    }
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const createAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      triggered: false,
    };
    saveAlerts([...alerts, newAlert]);
    return newAlert;
  };

  const deleteAlert = (alertId: string) => {
    saveAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const toggleAlert = (alertId: string) => {
    saveAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const triggerAlert = (alert: PriceAlert, currentPrice: number) => {
    // Update alert as triggered
    saveAlerts(
      alerts.map((a) =>
        a.id === alert.id
          ? { ...a, triggered: true, triggeredAt: Date.now(), currentPrice }
          : a
      )
    );

    // Create notification
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      type: 'price_alert',
      title: `Price Alert: ${alert.tokenSymbol}`,
      message: getPriceAlertMessage(alert, currentPrice),
      timestamp: Date.now(),
      read: false,
      metadata: { alert, currentPrice },
    };

    addNotification(notification);

    // Send browser notification if permitted
    if (alert.notificationMethod.includes('browser') && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    }
  };

  const getPriceAlertMessage = (alert: PriceAlert, currentPrice: number): string => {
    switch (alert.type) {
      case 'above':
        return `${alert.tokenSymbol} is now $${currentPrice.toFixed(2)}, above your target of $${alert.targetPrice?.toFixed(2)}`;
      case 'below':
        return `${alert.tokenSymbol} is now $${currentPrice.toFixed(2)}, below your target of $${alert.targetPrice?.toFixed(2)}`;
      case 'percent_change':
        const change = ((currentPrice - alert.currentPrice) / alert.currentPrice) * 100;
        return `${alert.tokenSymbol} has changed ${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
      default:
        return `Price alert triggered for ${alert.tokenSymbol}`;
    }
  };

  const addNotification = (notification: Notification) => {
    saveNotifications([notification, ...notifications]);
  };

  const markAsRead = (notificationId: string) => {
    saveNotifications(
      notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    saveNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    saveNotifications(notifications.filter((notif) => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const startPriceMonitoring = () => {
    // This would integrate with a price feed service
    // For now, it's a placeholder
    const interval = setInterval(() => {
      checkAlerts();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  };

  const checkAlerts = async () => {
    const activeAlerts = alerts.filter((alert) => alert.isActive && !alert.triggered);

    for (const alert of activeAlerts) {
      try {
        // Mock price check - in production, fetch from API
        const mockPrice = alert.currentPrice * (1 + (Math.random() - 0.5) * 0.1);

        const shouldTrigger = checkAlertCondition(alert, mockPrice);
        if (shouldTrigger) {
          triggerAlert(alert, mockPrice);
        }
      } catch (error) {
        console.error('Error checking alert:', error);
      }
    }
  };

  const checkAlertCondition = (alert: PriceAlert, currentPrice: number): boolean => {
    switch (alert.type) {
      case 'above':
        return alert.targetPrice ? currentPrice >= alert.targetPrice : false;
      case 'below':
        return alert.targetPrice ? currentPrice <= alert.targetPrice : false;
      case 'percent_change':
        if (!alert.percentChange) return false;
        const change = ((currentPrice - alert.currentPrice) / alert.currentPrice) * 100;
        return Math.abs(change) >= Math.abs(alert.percentChange);
      default:
        return false;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    alerts,
    notifications,
    unreadCount,
    createAlert,
    deleteAlert,
    toggleAlert,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };
}

