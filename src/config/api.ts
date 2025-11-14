/**
 * API client configurations
 * @module config/api
 */

import { API_ENDPOINTS, API_TIMEOUTS, API_RETRY_CONFIG } from '@/constants/api';

/**
 * Axios configuration for different API clients
 */
export const API_CLIENTS = {
  covalent: {
    baseURL: API_ENDPOINTS.COVALENT_BASE,
    timeout: API_TIMEOUTS.DEFAULT,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      key: process.env.COVALENT_API_KEY,
    },
  },
  coingecko: {
    baseURL: API_ENDPOINTS.COINGECKO,
    timeout: API_TIMEOUTS.TOKEN_PRICE,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  blockchain: {
    timeout: API_TIMEOUTS.BLOCKCHAIN_RPC,
    headers: {
      'Content-Type': 'application/json',
    },
  },
} as const;

/**
 * Retry configuration for API requests
 */
export const RETRY_CONFIG = {
  maxRetries: API_RETRY_CONFIG.MAX_RETRIES,
  retryDelay: API_RETRY_CONFIG.RETRY_DELAY,
  retryCondition: (error: any) => {
    // Retry on network errors or 5xx errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === 'ECONNABORTED'
    );
  },
  shouldResetTimeout: true,
} as const;

/**
 * Request interceptor configuration
 */
export const REQUEST_INTERCEPTORS = {
  addTimestamp: true,
  addRequestId: true,
  logRequests: process.env.NODE_ENV === 'development',
} as const;

/**
 * Response interceptor configuration
 */
export const RESPONSE_INTERCEPTORS = {
  transformDates: true,
  handleErrors: true,
  logResponses: process.env.NODE_ENV === 'development',
} as const;

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  enabled: true,
  excludeHeaders: ['authorization', 'cookie'],
  ttl: 60000, // 1 minute default
  maxSize: 100, // Maximum number of cached responses
} as const;

