/**
 * Base API client with retry logic and error handling
 */

import { NetworkError, withErrorHandling } from './service-error-handler';
import { serviceCache } from './service-cache';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export class ApiClientBase {
  protected baseURL: string;
  protected timeout: number;
  protected retries: number;
  protected retryDelay: number;
  protected headers: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.headers = config.headers || {};
  }

  protected async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new NetworkError(
          `API request failed: ${response.statusText}`,
          { status: response.status, endpoint }
        );
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.retries) {
        await this.delay(this.retryDelay * attempt);
        return this.fetchWithRetry<T>(endpoint, options, attempt + 1);
      }
      throw error;
    }
  }

  protected async get<T>(
    endpoint: string,
    useCache: boolean = false,
    cacheTTL?: number
  ): Promise<T> {
    const cacheKey = `GET:${this.baseURL}${endpoint}`;
    
    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => withErrorHandling(
          () => this.fetchWithRetry<T>(endpoint, { method: 'GET' }),
          `API GET ${endpoint}`
        ),
        cacheTTL
      );
    }

    return withErrorHandling(
      () => this.fetchWithRetry<T>(endpoint, { method: 'GET' }),
      `API GET ${endpoint}`
    );
  }

  protected async post<T>(endpoint: string, body: unknown): Promise<T> {
    return withErrorHandling(
      () => this.fetchWithRetry<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
      `API POST ${endpoint}`
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

