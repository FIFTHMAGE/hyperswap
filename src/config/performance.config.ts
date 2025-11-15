/**
 * Performance configuration
 */

export const performanceConfig = {
  // Cache TTLs
  cache: {
    tokenPrices: 30000, // 30 seconds
    tokenBalances: 10000, // 10 seconds  
    swapQuotes: 15000, // 15 seconds
    poolData: 60000, // 1 minute
    analytics: 300000, // 5 minutes
  },

  // Request limits
  rateLimit: {
    maxRequestsPerMinute: 60,
    maxConcurrentRequests: 10,
  },

  // Timeouts
  timeouts: {
    api: 30000, // 30 seconds
    rpc: 10000, // 10 seconds
    websocket: 5000, // 5 seconds
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoffMs: 1000,
    backoffMultiplier: 2,
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;

