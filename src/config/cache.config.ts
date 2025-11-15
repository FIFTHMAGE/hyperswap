/**
 * Cache configuration
 * @module config/cache
 */

export const CACHE_CONFIG = {
  // Cache strategies
  strategies: {
    prices: 'stale-while-revalidate',
    balances: 'cache-first',
    tokens: 'cache-first',
    quotes: 'network-first',
  },

  // TTL (time to live) in milliseconds
  ttl: {
    prices: 30000, // 30 seconds
    balances: 60000, // 1 minute
    tokens: 3600000, // 1 hour
    quotes: 10000, // 10 seconds
    nfts: 1800000, // 30 minutes
    portfolio: 120000, // 2 minutes
  },

  // Max sizes
  maxSizes: {
    memory: 100, // 100 entries
    localStorage: 1000, // 1000 entries
    indexedDB: 10000, // 10000 entries
  },

  // Invalidation rules
  invalidation: {
    onChainSwitch: ['balances', 'tokens', 'prices'],
    onWalletChange: ['balances', 'portfolio'],
    onError: [],
  },
};

export type CacheKey = keyof typeof CACHE_CONFIG.ttl;
export type CacheStrategy = 'cache-first' | 'network-first' | 'stale-while-revalidate';
