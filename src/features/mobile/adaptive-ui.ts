/**
 * Adaptive UI Utilities
 * Adjust UI based on device capabilities and conditions
 */

import { isLowEndDevice, shouldLoadHighQuality } from './performance';

export interface AdaptiveConfig {
  animations: boolean;
  highQualityImages: boolean;
  lazyLoad: boolean;
  reducedMotion: boolean;
}

/**
 * Get adaptive configuration based on device
 */
export function getAdaptiveConfig(): AdaptiveConfig {
  const isLowEnd = isLowEndDevice();
  const canLoadHighQuality = shouldLoadHighQuality();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    animations: !isLowEnd && !prefersReducedMotion,
    highQualityImages: canLoadHighQuality && !isLowEnd,
    lazyLoad: true,
    reducedMotion: prefersReducedMotion,
  };
}

/**
 * React hook for adaptive UI
 */
export function useAdaptiveUI() {
  if (typeof window === 'undefined') {
    return {
      animations: true,
      highQualityImages: true,
      lazyLoad: true,
      reducedMotion: false,
    };
  }

  return getAdaptiveConfig();
}

