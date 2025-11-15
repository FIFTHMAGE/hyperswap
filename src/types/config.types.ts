/**
 * Configuration types
 */

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  wsBaseUrl: string;
  features: {
    swapEnabled: boolean;
    poolsEnabled: boolean;
    analyticsEnabled: boolean;
    wrappedEnabled: boolean;
  };
}

export interface SecurityConfig {
  maxRequestsPerMinute: number;
  sessionTimeout: number;
  csrfProtection: boolean;
  corsOrigins: string[];
}

export interface CacheConfig {
  enabled: boolean;
  ttl: Record<string, number>;
  maxSize: number;
}

