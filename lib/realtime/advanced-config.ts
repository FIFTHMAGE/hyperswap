/**
 * Advanced Real-time Configuration
 * Centralized configuration for WebSocket and real-time features
 */

export interface WebSocketEndpoint {
  url: string;
  priority: number;
  region?: string;
  maxConnections?: number;
}

export interface ChannelConfig {
  name: string;
  enabled: boolean;
  throttleMs?: number;
  batchSize?: number;
  compression?: boolean;
  persistSubscription?: boolean;
}

export interface RealtimeConfig {
  endpoints: WebSocketEndpoint[];
  channels: ChannelConfig[];
  connection: {
    maxReconnectAttempts: number;
    reconnectDelayMs: number;
    reconnectBackoff: 'linear' | 'exponential';
    heartbeatIntervalMs: number;
    connectionTimeoutMs: number;
    pingTimeoutMs: number;
  };
  performance: {
    enableCompression: boolean;
    compressionThreshold: number;
    maxMessageQueueSize: number;
    messageBufferMs: number;
    enableBatching: boolean;
    maxBatchSize: number;
  };
  security: {
    enableEncryption: boolean;
    validateMessages: boolean;
    maxMessageSize: number;
    allowedOrigins: string[];
  };
  monitoring: {
    enableMetrics: boolean;
    metricsIntervalMs: number;
    logErrors: boolean;
    logWarnings: boolean;
  };
}

export const DEFAULT_REALTIME_CONFIG: RealtimeConfig = {
  endpoints: [
    {
      url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
      priority: 1,
      region: 'us-east',
      maxConnections: 5,
    },
    {
      url: process.env.NEXT_PUBLIC_WS_BACKUP_URL || 'wss://backup.hyperswap.io/ws',
      priority: 2,
      region: 'us-west',
      maxConnections: 5,
    },
  ],
  channels: [
    {
      name: 'price-updates',
      enabled: true,
      throttleMs: 1000,
      compression: true,
    },
    {
      name: 'order-book',
      enabled: true,
      throttleMs: 500,
      batchSize: 10,
      compression: true,
    },
    {
      name: 'trades',
      enabled: true,
      throttleMs: 0,
      compression: false,
    },
    {
      name: 'portfolio',
      enabled: true,
      throttleMs: 5000,
      persistSubscription: true,
    },
    {
      name: 'notifications',
      enabled: true,
      throttleMs: 0,
    },
    {
      name: 'market-metrics',
      enabled: true,
      throttleMs: 3000,
      compression: true,
    },
    {
      name: 'swap-execution',
      enabled: true,
      throttleMs: 0,
      persistSubscription: true,
    },
  ],
  connection: {
    maxReconnectAttempts: 10,
    reconnectDelayMs: 1000,
    reconnectBackoff: 'exponential',
    heartbeatIntervalMs: 30000,
    connectionTimeoutMs: 10000,
    pingTimeoutMs: 5000,
  },
  performance: {
    enableCompression: true,
    compressionThreshold: 1024, // 1KB
    maxMessageQueueSize: 1000,
    messageBufferMs: 100,
    enableBatching: true,
    maxBatchSize: 10,
  },
  security: {
    enableEncryption: true,
    validateMessages: true,
    maxMessageSize: 1024 * 1024, // 1MB
    allowedOrigins: [
      'https://hyperswap.io',
      'https://www.hyperswap.io',
      'http://localhost:3000',
    ],
  },
  monitoring: {
    enableMetrics: true,
    metricsIntervalMs: 60000,
    logErrors: true,
    logWarnings: false,
  },
};

/**
 * Get configuration for a specific channel
 */
export function getChannelConfig(
  channelName: string,
  config: RealtimeConfig = DEFAULT_REALTIME_CONFIG
): ChannelConfig | undefined {
  return config.channels.find(c => c.name === channelName);
}

/**
 * Get optimal WebSocket endpoint based on priority and region
 */
export function getOptimalEndpoint(
  config: RealtimeConfig = DEFAULT_REALTIME_CONFIG,
  preferredRegion?: string
): WebSocketEndpoint {
  const endpoints = [...config.endpoints].sort((a, b) => a.priority - b.priority);
  
  if (preferredRegion) {
    const regionalEndpoint = endpoints.find(e => e.region === preferredRegion);
    if (regionalEndpoint) return regionalEndpoint;
  }
  
  return endpoints[0];
}

/**
 * Calculate reconnection delay with backoff
 */
export function calculateReconnectDelay(
  attempt: number,
  config: RealtimeConfig = DEFAULT_REALTIME_CONFIG
): number {
  const baseDelay = config.connection.reconnectDelayMs;
  
  if (config.connection.reconnectBackoff === 'exponential') {
    return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30s
  }
  
  return baseDelay * (attempt + 1); // Linear
}

/**
 * Validate message against security constraints
 */
export function validateMessage(
  message: string,
  config: RealtimeConfig = DEFAULT_REALTIME_CONFIG
): boolean {
  if (!config.security.validateMessages) return true;
  
  // Check message size
  if (message.length > config.security.maxMessageSize) {
    console.error('Message exceeds maximum size');
    return false;
  }
  
  // Try parsing JSON
  try {
    JSON.parse(message);
    return true;
  } catch {
    console.error('Invalid JSON message');
    return false;
  }
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(
  origin: string,
  config: RealtimeConfig = DEFAULT_REALTIME_CONFIG
): boolean {
  return config.security.allowedOrigins.some(allowed => 
    origin.includes(allowed) || allowed === '*'
  );
}

/**
 * Metrics collector for monitoring
 */
export class RealtimeMetrics {
  private messagesSent = 0;
  private messagesReceived = 0;
  private bytesTransferred = 0;
  private errors = 0;
  private reconnections = 0;
  private avgLatency = 0;
  private latencySamples: number[] = [];

  recordMessageSent(): void {
    this.messagesSent++;
  }

  recordMessageReceived(bytes: number): void {
    this.messagesReceived++;
    this.bytesTransferred += bytes;
  }

  recordError(): void {
    this.errors++;
  }

  recordReconnection(): void {
    this.reconnections++;
  }

  recordLatency(ms: number): void {
    this.latencySamples.push(ms);
    if (this.latencySamples.length > 100) {
      this.latencySamples.shift();
    }
    this.avgLatency = this.latencySamples.reduce((a, b) => a + b, 0) / this.latencySamples.length;
  }

  getMetrics() {
    return {
      messagesSent: this.messagesSent,
      messagesReceived: this.messagesReceived,
      bytesTransferred: this.bytesTransferred,
      errors: this.errors,
      reconnections: this.reconnections,
      avgLatency: Math.round(this.avgLatency),
      latencySamples: this.latencySamples.length,
    };
  }

  reset(): void {
    this.messagesSent = 0;
    this.messagesReceived = 0;
    this.bytesTransferred = 0;
    this.errors = 0;
    this.reconnections = 0;
    this.avgLatency = 0;
    this.latencySamples = [];
  }
}

