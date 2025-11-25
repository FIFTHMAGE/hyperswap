import axios, { AxiosInstance } from 'axios';

import { COVALENT_API_BASE_URL } from '../constants/api';

class CovalentAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: COVALENT_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include API key
    this.client.interceptors.request.use((config) => {
      const apiKey = process.env.COVALENT_API_KEY;
      if (apiKey) {
        config.headers['Authorization'] = `Bearer ${apiKey}`;
      }
      return config;
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<{ data: T }>(url, { params });
    return response.data.data;
  }
}

export const covalentClient = new CovalentAPIClient();

