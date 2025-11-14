/**
 * API client configuration and base setup
 * @module services/api/client
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CLIENTS, RETRY_CONFIG } from '@/config/api';

/**
 * Create axios instance with default configuration
 */
function createAxiosInstance(config: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });
}

/**
 * Covalent API client
 */
export const covalentClient = createAxiosInstance(API_CLIENTS.covalent);

/**
 * CoinGecko API client
 */
export const coingeckoClient = createAxiosInstance(API_CLIENTS.coingecko);

/**
 * Generic API request wrapper with error handling
 */
export async function apiRequest<T>(
  client: AxiosInstance,
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await client.request(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || error.message || 'API request failed'
      );
    }
    throw error;
  }
}

/**
 * GET request helper
 */
export async function get<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest<T>(client, { ...config, method: 'GET', url });
}

/**
 * POST request helper
 */
export async function post<T>(
  client: AxiosInstance,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest<T>(client, { ...config, method: 'POST', url, data });
}

/**
 * Retry wrapper for API requests
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = RETRY_CONFIG.retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

