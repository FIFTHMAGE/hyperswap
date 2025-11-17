/**
 * Network configuration
 * @module config/network
 */

export const NETWORK_CONFIG = {
  // API timeouts
  timeouts: {
    default: 30000, // 30s
    swap: 45000, // 45s
    quote: 10000, // 10s
    balance: 15000, // 15s
  },

  // Retry configuration
  retries: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },

  // Rate limiting
  rateLimit: {
    requestsPerSecond: 10,
    burstSize: 20,
  },

  // WebSocket configuration
  websocket: {
    reconnectDelay: 5000,
    maxReconnectAttempts: 10,
    pingInterval: 30000,
  },

  // Cache configuration
  cache: {
    balancesTTL: 60000, // 1 minute
    pricesTTL: 30000, // 30 seconds
    quotesTTL: 10000, // 10 seconds
    tokensTTL: 3600000, // 1 hour
  },
};

export const RPC_ENDPOINTS = {
  ethereum: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'],
  polygon: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'],
  arbitrum: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
  optimism: ['https://mainnet.optimism.io', 'https://rpc.ankr.com/optimism'],
  base: ['https://mainnet.base.org', 'https://base.llamarpc.com'],
};
