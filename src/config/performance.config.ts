/**
 * Performance optimization configuration
 * @module config
 */

export interface PerformanceConfig {
  enableCodeSplitting: boolean;
  enableLazyLoading: boolean;
  enableServiceWorker: boolean;
  enableImageOptimization: boolean;
  cacheMaxAge: number;
  bundleSizeLimit: number;
  prefetchRoutes: string[];
  preloadResources: string[];
}

export const performanceConfig: PerformanceConfig = {
  enableCodeSplitting: true,
  enableLazyLoading: true,
  enableServiceWorker: process.env.NODE_ENV === 'production',
  enableImageOptimization: true,
  cacheMaxAge: 86400, // 24 hours in seconds
  bundleSizeLimit: 500000, // 500KB in bytes
  prefetchRoutes: ['/swap', '/liquidity', '/portfolio'],
  preloadResources: ['/fonts/inter-var.woff2', '/images/logo.svg'],
};

export const getPerformanceConfig = (): PerformanceConfig => performanceConfig;

/**
 * Check if code splitting is enabled
 */
export const isCodeSplittingEnabled = (): boolean => performanceConfig.enableCodeSplitting;

/**
 * Check if lazy loading is enabled
 */
export const isLazyLoadingEnabled = (): boolean => performanceConfig.enableLazyLoading;

/**
 * Check if service worker is enabled
 */
export const isServiceWorkerEnabled = (): boolean => performanceConfig.enableServiceWorker;

/**
 * Get cache max age
 */
export const getCacheMaxAge = (): number => performanceConfig.cacheMaxAge;

/**
 * Get bundle size limit
 */
export const getBundleSizeLimit = (): number => performanceConfig.bundleSizeLimit;
