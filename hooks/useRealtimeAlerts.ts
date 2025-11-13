/**
 * Real-time Alerts Hook
 * Manages price alerts, notifications, and user-defined triggers
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { getNotificationManager } from '@/lib/realtime/notification-manager';

export interface PriceAlert {
  id: string;
  token: string;
  symbol: string;
  condition: 'above' | 'below' | 'change';
  targetPrice?: number;
  changePercent?: number;
  currentPrice: number;
  triggered: boolean;
  createdAt: number;
  triggeredAt?: number;
}

export interface AlertConfig {
  enableNotifications: boolean;
  enableSound: boolean;
  autoDisable: boolean; // Disable alert after triggering
  repeatDelay: number; // Minimum time between repeated alerts (ms)
}

const DEFAULT_CONFIG: AlertConfig = {
  enableNotifications: true,
  enableSound: true,
  autoDisable: true,
  repeatDelay: 300000, // 5 minutes
};

export function useRealtimeAlerts(config: Partial<AlertConfig> = {}) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [config_ ] = useState<AlertConfig>({ ...DEFAULT_CONFIG, ...config });
  
  const notificationManager = getNotificationManager();
  const { isConnected, lastMessage, sendMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
    autoConnect: true,
  });

  // Subscribe to price updates for alerts
  useEffect(() => {
    if (isConnected && alerts.length > 0) {
      const tokens = alerts
        .filter(a => !a.triggered)
        .map(a => a.token);

      if (tokens.length > 0) {
        sendMessage({
          type: 'subscribe',
          channel: 'alerts',
          params: { tokens },
        });

        return () => {
          sendMessage({
            type: 'unsubscribe',
            channel: 'alerts',
          });
        };
      }
    }
  }, [isConnected, alerts, sendMessage]);

  // Process incoming price updates
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.channel === 'price-update' || data.channel === 'alerts') {
          checkAlerts(data.token, data.price, data.change24h);
        }
      } catch (err) {
        console.error('Error processing alert message:', err);
      }
    }
  }, [lastMessage]);

  // Check if any alerts should be triggered
  const checkAlerts = useCallback((token: string, price: number, change24h: number) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = prevAlerts.map(alert => {
        if (alert.token === token && !alert.triggered) {
          let shouldTrigger = false;

          switch (alert.condition) {
            case 'above':
              shouldTrigger = alert.targetPrice !== undefined && price >= alert.targetPrice;
              break;
            case 'below':
              shouldTrigger = alert.targetPrice !== undefined && price <= alert.targetPrice;
              break;
            case 'change':
              shouldTrigger = alert.changePercent !== undefined && 
                Math.abs(change24h) >= Math.abs(alert.changePercent);
              break;
          }

          if (shouldTrigger) {
            // Trigger notification
            if (config_.enableNotifications) {
              notificationManager.add({
                type: 'price-alert',
                priority: 'high',
                title: `Price Alert: ${alert.symbol}`,
                message: getAlertMessage(alert, price, change24h),
                actionUrl: `/swap?token=${token}`,
                actionLabel: 'Trade Now',
                metadata: { alert, price, change24h },
              });
            }

            return {
              ...alert,
              triggered: true,
              triggeredAt: Date.now(),
              currentPrice: price,
            };
          }

          return { ...alert, currentPrice: price };
        }
        return alert;
      });

      return updatedAlerts;
    });
  }, [config_, notificationManager]);

  // Get alert message
  const getAlertMessage = (alert: PriceAlert, price: number, change24h: number): string => {
    switch (alert.condition) {
      case 'above':
        return `${alert.symbol} is now $${price.toFixed(2)}, above your target of $${alert.targetPrice?.toFixed(2)}`;
      case 'below':
        return `${alert.symbol} is now $${price.toFixed(2)}, below your target of $${alert.targetPrice?.toFixed(2)}`;
      case 'change':
        return `${alert.symbol} has changed by ${change24h.toFixed(2)}% in 24h, exceeding your ${alert.changePercent?.toFixed(2)}% threshold`;
      default:
        return `Price alert triggered for ${alert.symbol}`;
    }
  };

  // Create a new alert
  const createAlert = useCallback((
    token: string,
    symbol: string,
    condition: 'above' | 'below' | 'change',
    targetPrice?: number,
    changePercent?: number
  ): string => {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAlert: PriceAlert = {
      id,
      token,
      symbol,
      condition,
      targetPrice,
      changePercent,
      currentPrice: 0,
      triggered: false,
      createdAt: Date.now(),
    };

    setAlerts(prev => [...prev, newAlert]);
    
    // Notify server about new alert
    if (isConnected) {
      sendMessage({
        type: 'create-alert',
        alert: newAlert,
      });
    }

    return id;
  }, [isConnected, sendMessage]);

  // Remove an alert
  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    
    if (isConnected) {
      sendMessage({
        type: 'remove-alert',
        alertId: id,
      });
    }
  }, [isConnected, sendMessage]);

  // Reset triggered alert
  const resetAlert = useCallback((id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, triggered: false, triggeredAt: undefined }
          : alert
      )
    );
  }, []);

  // Clear all alerts
  const clearAll = useCallback(() => {
    setAlerts([]);
    
    if (isConnected) {
      sendMessage({
        type: 'clear-alerts',
      });
    }
  }, [isConnected, sendMessage]);

  // Get active alerts (not triggered)
  const getActiveAlerts = useCallback(() => {
    return alerts.filter(a => !a.triggered);
  }, [alerts]);

  // Get triggered alerts
  const getTriggeredAlerts = useCallback(() => {
    return alerts.filter(a => a.triggered);
  }, [alerts]);

  // Get alerts for specific token
  const getAlertsForToken = useCallback((token: string) => {
    return alerts.filter(a => a.token === token);
  }, [alerts]);

  return {
    alerts,
    createAlert,
    removeAlert,
    resetAlert,
    clearAll,
    getActiveAlerts,
    getTriggeredAlerts,
    getAlertsForToken,
    isConnected,
  };
}

