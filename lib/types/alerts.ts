/**
 * Price alert type definitions
 */

export interface PriceAlert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  chainId: number;
  type: 'above' | 'below' | 'percent_change';
  targetPrice?: number;
  percentChange?: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: number;
  triggeredAt?: number;
  notificationMethod: ('push' | 'email' | 'browser')[];
}

export interface Notification {
  id: string;
  type: 'price_alert' | 'transaction' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface AlertCondition {
  type: 'price_above' | 'price_below' | 'percent_up' | 'percent_down';
  value: number;
  timeframe?: '1h' | '24h' | '7d';
}

