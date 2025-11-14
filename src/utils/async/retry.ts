/**
 * Retry logic utilities
 * @module utils/async/retry
 */

import { API_RETRY_CONFIG } from '@/constants/api';

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
}

/**
 * Retry an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = API_RETRY_CONFIG.MAX_RETRIES,
    retryDelay = API_RETRY_CONFIG.RETRY_DELAY,
    backoffMultiplier = API_RETRY_CONFIG.BACKOFF_MULTIPLIER,
    shouldRetry = () => true,
  } = options;

  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries || !shouldRetry(error, attempt)) {
        throw error;
      }
      
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with fixed delay
 */
export async function retryWithDelay<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return retryWithBackoff(fn, {
    maxRetries,
    retryDelay: delay,
    backoffMultiplier: 1, // No exponential backoff
  });
}

/**
 * Retry on specific error
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  errorCheck: (error: any) => boolean,
  maxRetries: number = 3
): Promise<T> {
  return retryWithBackoff(fn, {
    maxRetries,
    shouldRetry: (error) => errorCheck(error),
  });
}

