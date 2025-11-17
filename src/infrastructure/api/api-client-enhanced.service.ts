/**
 * Enhanced API client with retry, caching, and error handling
 * @module services/api
 */

import type { ApiRequestConfig, ApiResponse } from '@/types/api.types';

import { cacheStrategy } from '../cache/cache-strategy.service';
import { rateLimiter } from '../rate-limit/rate-limiter.service';
import { retryService } from '../retry/retry.service';

class ApiClientEnhanced {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute API request with retry, caching, and rate limiting
   */
  async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = config.method || 'GET';
    const cacheKey = `${method}:${url}`;

    // Check rate limit
    const canProceed = await rateLimiter.tryAcquire(this.baseUrl);
    if (!canProceed) {
      throw new Error('Rate limit exceeded');
    }

    // Check cache for GET requests
    if (method === 'GET' && config.cache !== false) {
      const cached = cacheStrategy.get<T>('api', cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          timestamp: Date.now(),
          meta: { requestId: '', duration: 0, cached: true },
        };
      }
    }

    // Execute request with retry
    const response = await retryService.execute(async () => {
      const res = await fetch(url, {
        method,
        headers: { ...this.defaultHeaders, ...config.headers },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: config.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data as T;
    });

    // Cache successful GET responses
    if (method === 'GET' && response) {
      cacheStrategy.set('api', cacheKey, response, 60000);
    }

    return {
      success: true,
      data: response,
      timestamp: Date.now(),
      meta: { requestId: '', duration: 0, cached: false },
    };
  }

  get<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClientEnhanced(
  process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'
);
