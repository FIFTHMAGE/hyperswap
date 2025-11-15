/**
 * Performance config tests
 */

import {
  performanceConfig,
  getPerformanceConfig,
  isCodeSplittingEnabled,
  isLazyLoadingEnabled,
  getCacheMaxAge,
  getBundleSizeLimit,
} from '@/config/performance.config';

describe('Performance Config', () => {
  test('exports performance configuration', () => {
    expect(performanceConfig).toBeDefined();
    expect(performanceConfig.enableCodeSplitting).toBeDefined();
    expect(performanceConfig.enableLazyLoading).toBeDefined();
    expect(performanceConfig.cacheMaxAge).toBeDefined();
  });

  test('getPerformanceConfig returns config', () => {
    const config = getPerformanceConfig();
    expect(config).toEqual(performanceConfig);
  });

  test('isCodeSplittingEnabled returns boolean', () => {
    expect(typeof isCodeSplittingEnabled()).toBe('boolean');
  });

  test('isLazyLoadingEnabled returns boolean', () => {
    expect(typeof isLazyLoadingEnabled()).toBe('boolean');
  });

  test('getCacheMaxAge returns number', () => {
    expect(typeof getCacheMaxAge()).toBe('number');
    expect(getCacheMaxAge()).toBeGreaterThan(0);
  });

  test('getBundleSizeLimit returns number', () => {
    expect(typeof getBundleSizeLimit()).toBe('number');
    expect(getBundleSizeLimit()).toBeGreaterThan(0);
  });

  test('prefetchRoutes is an array', () => {
    expect(Array.isArray(performanceConfig.prefetchRoutes)).toBe(true);
  });

  test('preloadResources is an array', () => {
    expect(Array.isArray(performanceConfig.preloadResources)).toBe(true);
  });
});
