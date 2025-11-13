/**
 * WebSocket Helper Utilities
 * Common utilities for WebSocket operations
 */

export interface WebSocketMessage {
  type: string;
  channel?: string;
  data?: any;
  timestamp?: number;
}

/**
 * Create a standardized WebSocket message
 */
export function createMessage(
  type: string,
  channel?: string,
  data?: any
): string {
  const message: WebSocketMessage = {
    type,
    timestamp: Date.now(),
  };

  if (channel) message.channel = channel;
  if (data) message.data = data;

  return JSON.stringify(message);
}

/**
 * Parse a WebSocket message safely
 */
export function parseMessage(message: string): WebSocketMessage | null {
  try {
    return JSON.parse(message);
  } catch (error) {
    console.error('Failed to parse WebSocket message:', error);
    return null;
  }
}

/**
 * Check if WebSocket is supported
 */
export function isWebSocketSupported(): boolean {
  return typeof WebSocket !== 'undefined';
}

/**
 * Get WebSocket ready state as string
 */
export function getReadyStateString(readyState: number): string {
  const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
  return states[readyState] || 'UNKNOWN';
}

/**
 * Calculate message size in bytes
 */
export function getMessageSize(message: string): number {
  return new Blob([message]).size;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Validate WebSocket URL
 */
export function isValidWebSocketUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'ws:' || parsed.protocol === 'wss:';
  } catch {
    return false;
  }
}

/**
 * Get optimal WebSocket URL (prefer wss over ws)
 */
export function getSecureWebSocketUrl(url: string): string {
  if (url.startsWith('ws://')) {
    return url.replace('ws://', 'wss://');
  }
  return url;
}

/**
 * Create a heartbeat mechanism
 */
export class WebSocketHeartbeat {
  private interval: NodeJS.Timeout | null = null;
  private lastPong: number = Date.now();
  private readonly intervalMs: number;
  private readonly timeoutMs: number;
  private readonly onTimeout: () => void;

  constructor(
    intervalMs: number = 30000,
    timeoutMs: number = 5000,
    onTimeout: () => void = () => {}
  ) {
    this.intervalMs = intervalMs;
    this.timeoutMs = timeoutMs;
    this.onTimeout = onTimeout;
  }

  start(sendPing: () => void): void {
    this.stop();
    this.lastPong = Date.now();

    this.interval = setInterval(() => {
      const timeSinceLastPong = Date.now() - this.lastPong;
      
      if (timeSinceLastPong > this.timeoutMs + this.intervalMs) {
        console.warn('WebSocket heartbeat timeout');
        this.onTimeout();
        return;
      }

      sendPing();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  receivePong(): void {
    this.lastPong = Date.now();
  }

  getTimeSinceLastPong(): number {
    return Date.now() - this.lastPong;
  }
}

/**
 * Message rate limiter
 */
export class MessageRateLimiter {
  private messageCount = 0;
  private resetTime = Date.now();
  private readonly maxMessages: number;
  private readonly windowMs: number;

  constructor(maxMessages: number = 100, windowMs: number = 1000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
  }

  canSend(): boolean {
    const now = Date.now();
    
    if (now - this.resetTime >= this.windowMs) {
      this.messageCount = 0;
      this.resetTime = now;
    }

    if (this.messageCount >= this.maxMessages) {
      return false;
    }

    this.messageCount++;
    return true;
  }

  getRemainingMessages(): number {
    const now = Date.now();
    if (now - this.resetTime >= this.windowMs) {
      return this.maxMessages;
    }
    return Math.max(0, this.maxMessages - this.messageCount);
  }

  reset(): void {
    this.messageCount = 0;
    this.resetTime = Date.now();
  }
}

/**
 * Connection quality monitor
 */
export class ConnectionQualityMonitor {
  private latencySamples: number[] = [];
  private errorCount = 0;
  private successCount = 0;

  recordLatency(ms: number): void {
    this.latencySamples.push(ms);
    if (this.latencySamples.length > 100) {
      this.latencySamples.shift();
    }
  }

  recordSuccess(): void {
    this.successCount++;
  }

  recordError(): void {
    this.errorCount++;
  }

  getQuality(): 'excellent' | 'good' | 'fair' | 'poor' {
    const avgLatency = this.getAverageLatency();
    const errorRate = this.getErrorRate();

    if (avgLatency < 50 && errorRate < 0.01) return 'excellent';
    if (avgLatency < 100 && errorRate < 0.05) return 'good';
    if (avgLatency < 200 && errorRate < 0.1) return 'fair';
    return 'poor';
  }

  getAverageLatency(): number {
    if (this.latencySamples.length === 0) return 0;
    const sum = this.latencySamples.reduce((a, b) => a + b, 0);
    return sum / this.latencySamples.length;
  }

  getErrorRate(): number {
    const total = this.errorCount + this.successCount;
    return total === 0 ? 0 : this.errorCount / total;
  }

  getStats() {
    return {
      avgLatency: Math.round(this.getAverageLatency()),
      minLatency: Math.min(...this.latencySamples),
      maxLatency: Math.max(...this.latencySamples),
      errorCount: this.errorCount,
      successCount: this.successCount,
      errorRate: this.getErrorRate(),
      quality: this.getQuality(),
    };
  }

  reset(): void {
    this.latencySamples = [];
    this.errorCount = 0;
    this.successCount = 0;
  }
}

/**
 * Auto-reconnect manager
 */
export class AutoReconnectManager {
  private attempts = 0;
  private readonly maxAttempts: number;
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(
    maxAttempts: number = 10,
    baseDelay: number = 1000,
    maxDelay: number = 30000
  ) {
    this.maxAttempts = maxAttempts;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  shouldReconnect(): boolean {
    return this.attempts < this.maxAttempts;
  }

  getDelay(): number {
    // Exponential backoff with jitter
    const exponential = Math.min(
      this.baseDelay * Math.pow(2, this.attempts),
      this.maxDelay
    );
    const jitter = Math.random() * 1000;
    return exponential + jitter;
  }

  scheduleReconnect(callback: () => void): void {
    if (!this.shouldReconnect()) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = this.getDelay();
    console.log(`Scheduling reconnect attempt ${this.attempts + 1} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.attempts++;
      callback();
    }, delay);
  }

  cancelReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  reset(): void {
    this.cancelReconnect();
    this.attempts = 0;
  }

  getAttempts(): number {
    return this.attempts;
  }
}

