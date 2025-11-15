/**
 * Retry service for resilient API calls
 * @module services/retry
 */

import type { RetryConfig } from '@/types/api.types';
import { wait } from '@/utils/async/promise';

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  retryableErrors: ['network', 'server'],
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

class RetryService {
  private config: RetryConfig = DEFAULT_CONFIG;

  /**
   * Execute function with retry logic
   */
  async execute<T>(fn: () => Promise<T>, config: Partial<RetryConfig> = {}): Promise<T> {
    const cfg = { ...this.config, ...config };
    let lastError: Error;

    for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on last attempt
        if (attempt === cfg.maxRetries) {
          throw lastError;
        }

        // Calculate delay
        const delay = cfg.exponentialBackoff
          ? cfg.retryDelay * Math.pow(2, attempt)
          : cfg.retryDelay;

        // Wait before retry
        await wait(delay);
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Configure retry settings
   */
  configure(config: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): RetryConfig {
    return { ...this.config };
  }
}

export const retryService = new RetryService();
