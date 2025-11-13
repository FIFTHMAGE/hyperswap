/**
 * Analytics event types
 * @module types/analytics/events
 */

/**
 * Event category
 */
export type EventCategory =
  | 'user'
  | 'swap'
  | 'liquidity'
  | 'portfolio'
  | 'navigation'
  | 'error';

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

/**
 * User event
 */
export interface UserEvent extends AnalyticsEvent {
  category: 'user';
  action: 'login' | 'logout' | 'register' | 'connect_wallet' | 'disconnect_wallet';
}

/**
 * Swap event
 */
export interface SwapEvent extends AnalyticsEvent {
  category: 'swap';
  action: 'quote_requested' | 'swap_initiated' | 'swap_completed' | 'swap_failed';
  properties: {
    inputToken: string;
    outputToken: string;
    amount: string;
    provider?: string;
  };
}

/**
 * Error event
 */
export interface ErrorEvent extends AnalyticsEvent {
  category: 'error';
  action: string;
  properties: {
    error: string;
    stack?: string;
    component?: string;
  };
}

