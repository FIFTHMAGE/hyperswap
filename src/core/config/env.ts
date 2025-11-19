/**
 * Environment variable management with validation
 * @module config/env
 */

import { EnvValidator, ValidatedEnv, getPublicEnv, isBrowser, isServer } from './validation';

/**
 * Environment validator singleton
 */
const envValidator = EnvValidator.getInstance();

/**
 * Exported type for validated environment
 */
export type Env = ValidatedEnv;

/**
 * Get validated environment variables
 * Caches the validation result for performance
 */
export function getEnv(): Env {
  return envValidator.get();
}

/**
 * Validate environment on initialization
 * Should be called early in the application lifecycle
 */
export function validateEnv(): Env {
  return envValidator.validate();
}

/**
 * Reset environment cache (useful for testing)
 */
export function resetEnvCache(): void {
  envValidator.reset();
}

/**
 * Environment check utilities
 */
export function isProduction(): boolean {
  return envValidator.isProduction();
}

export function isDevelopment(): boolean {
  return envValidator.isDevelopment();
}

export function isTest(): boolean {
  return envValidator.isTest();
}

/**
 * Safe environment variable access
 */
export { isBrowser, isServer, getPublicEnv };

/**
 * Get WalletConnect Project ID (public)
 */
export function getWalletConnectProjectId(): string {
  return getEnv().NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
}

/**
 * Get Covalent API Key (server-only)
 */
export function getCovalentApiKey(): string {
  if (isBrowser()) {
    throw new Error('Cannot access Covalent API key in browser environment');
  }
  return getEnv().COVALENT_API_KEY;
}

/**
 * Get application URL
 */
export function getAppUrl(): string {
  return getEnv().NEXT_PUBLIC_APP_URL;
}

/**
 * Get custom RPC URLs as array
 */
export function getCustomRpcUrls(): string[] {
  const urls = getEnv().NEXT_PUBLIC_CUSTOM_RPC_URLS;
  if (!urls) return [];

  return urls
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
}

/**
 * Get API rate limit configuration
 */
export function getRateLimitConfig() {
  const env = getEnv();
  return {
    limit: env.API_RATE_LIMIT,
    window: env.API_RATE_WINDOW,
  };
}

/**
 * Get cache TTL configuration
 */
export function getCacheTTL(): number {
  return getEnv().CACHE_TTL;
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return getEnv().NEXT_PUBLIC_ENABLE_ANALYTICS;
}

/**
 * Check if Sentry is enabled
 */
export function isSentryEnabled(): boolean {
  return getEnv().NEXT_PUBLIC_ENABLE_SENTRY;
}

/**
 * Get Sentry DSN
 */
export function getSentryDSN(): string | undefined {
  return getEnv().NEXT_PUBLIC_SENTRY_DSN;
}

/**
 * Check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return getEnv().NEXT_PUBLIC_ENABLE_DEBUG;
}

/**
 * Check if error display is enabled
 */
export function shouldShowErrors(): boolean {
  return getEnv().NEXT_PUBLIC_SHOW_ERRORS || isDevelopment();
}

/**
 * Environment configuration summary
 */
export function getEnvSummary() {
  const env = getEnv();
  return {
    environment: env.NODE_ENV,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    sentry: env.NEXT_PUBLIC_ENABLE_SENTRY,
    debug: env.NEXT_PUBLIC_ENABLE_DEBUG,
    rateLimit: {
      limit: env.API_RATE_LIMIT,
      window: env.API_RATE_WINDOW,
    },
    cache: {
      ttl: env.CACHE_TTL,
    },
  };
}
