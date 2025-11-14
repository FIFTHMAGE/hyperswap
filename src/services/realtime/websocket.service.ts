/**
 * WebSocket service for real-time connections
 * @module services/realtime/websocket
 */

export type WebSocketEventType = 'open' | 'close' | 'error' | 'message';
export type WebSocketListener = (event: any) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners = new Map<WebSocketEventType, Set<WebSocketListener>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = (event) => {
      this.reconnectAttempts = 0;
      this.emit('open', event);
    };

    this.ws.onclose = (event) => {
      this.emit('close', event);
      this.handleReconnect();
    };

    this.ws.onerror = (event) => {
      this.emit('error', event);
    };

    this.ws.onmessage = (event) => {
      this.emit('message', event);
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message
   */
  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Subscribe to event
   */
  on(event: WebSocketEventType, listener: WebSocketListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /**
   * Emit event to listeners
   */
  private emit(event: WebSocketEventType, data: any): void {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }

  /**
   * Handle reconnection
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

