/**
 * Real-time subscription types
 * @module types/realtime/subscription
 */

/**
 * Subscription channel
 */
export type SubscriptionChannel =
  | 'prices'
  | 'balances'
  | 'transactions'
  | 'notifications'
  | 'gas_prices';

/**
 * Subscription
 */
export interface Subscription {
  id: string;
  channel: SubscriptionChannel;
  params: Record<string, any>;
  callback: (data: any) => void;
  active: boolean;
  createdAt: number;
}

/**
 * Subscription manager state
 */
export interface SubscriptionManagerState {
  subscriptions: Map<string, Subscription>;
  connected: boolean;
  reconnecting: boolean;
}

