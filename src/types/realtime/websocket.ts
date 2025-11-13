/**
 * WebSocket message types
 * @module types/realtime/websocket
 */

/**
 * WebSocket connection state
 */
export type WSConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'error';

/**
 * WebSocket message type
 */
export type WSMessageType =
  | 'subscribe'
  | 'unsubscribe'
  | 'price_update'
  | 'balance_update'
  | 'transaction_update'
  | 'notification'
  | 'heartbeat'
  | 'error';

/**
 * Base WebSocket message
 */
export interface WSMessage<T = any> {
  type: WSMessageType;
  data: T;
  timestamp: number;
  id?: string;
}

/**
 * Subscribe message
 */
export interface WSSubscribeMessage extends WSMessage {
  type: 'subscribe';
  data: {
    channel: string;
    params?: Record<string, any>;
  };
}

/**
 * Price update message
 */
export interface WSPriceUpdateMessage extends WSMessage {
  type: 'price_update';
  data: {
    token: string;
    price: number;
    change24h: number;
  };
}

/**
 * WebSocket configuration
 */
export interface WSConfig {
  url: string;
  reconnect: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  timeout: number;
}

