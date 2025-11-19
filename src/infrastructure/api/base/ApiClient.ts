/**
 * Base API client with interceptors and error handling
 * @module infrastructure/api/base
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  onResponse?: (response: AxiosResponse) => AxosResponse;
  onError?: (error: unknown) => void;
}

/**
 * Base API Client class
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (requestConfig) => {
        if (config.onRequest) {
          return config.onRequest(requestConfig);
        }
        return requestConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (config.onResponse) {
          return config.onResponse(response);
        }
        return response;
      },
      (error) => {
        if (config.onError) {
          config.onError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}
