/**
 * API endpoints and configuration constants
 * @module constants/api
 */

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Covalent API
  COVALENT_BASE: 'https://api.covalenthq.com/v1',
  COVALENT_BALANCES: '/balances_v2',
  COVALENT_TRANSACTIONS: '/transactions_v2',
  COVALENT_TOKEN_HOLDERS: '/token_holders',
  COVALENT_TOKEN_PRICES: '/pricing/historical_by_addresses_v2',
  
  // Token price APIs
  COINGECKO: 'https://api.coingecko.com/api/v3',
  COINMARKETCAP: 'https://pro-api.coinmarketcap.com/v1',
  
  // Gas price APIs
  ETHERSCAN_GAS: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle',
  BLOCKNATIVE_GAS: 'https://api.blocknative.com/gasprices/blockprices',
} as const;

/**
 * API rate limits (requests per minute)
 */
export const API_RATE_LIMITS = {
  COVALENT: 5,
  COINGECKO_FREE: 10,
  COINGECKO_PRO: 500,
  ETHERSCAN_FREE: 5,
  ETHERSCAN_PRO: 100,
} as const;

/**
 * API request timeouts (milliseconds)
 */
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  BLOCKCHAIN_RPC: 10000, // 10 seconds
  TOKEN_PRICE: 5000, // 5 seconds
  LONG_POLLING: 60000, // 60 seconds
} as const;

/**
 * API retry configuration
 */
export const API_RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * Cache durations (milliseconds)
 */
export const CACHE_DURATIONS = {
  TOKEN_PRICE: 60000, // 1 minute
  TOKEN_BALANCE: 30000, // 30 seconds
  TOKEN_METADATA: 3600000, // 1 hour
  TRANSACTION_HISTORY: 300000, // 5 minutes
  GAS_PRICE: 15000, // 15 seconds
  POOL_DATA: 120000, // 2 minutes
} as const;

