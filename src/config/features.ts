/**
 * Feature flags system
 * @module config/features
 */

/**
 * Feature flag configuration
 */
interface FeatureFlag {
  enabled: boolean;
  description: string;
  enabledForChains?: number[];
  minimumVersion?: string;
}

/**
 * Feature flags
 */
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Core features
  SWAP: {
    enabled: true,
    description: 'Token swapping functionality',
  },
  LIQUIDITY_POOLS: {
    enabled: true,
    description: 'Liquidity pool discovery and management',
  },
  PORTFOLIO_TRACKING: {
    enabled: true,
    description: 'Portfolio value tracking and analytics',
  },
  YEAR_WRAPPED: {
    enabled: true,
    description: 'Year-in-review wrapped experience',
  },
  
  // Advanced features
  MULTI_HOP_SWAPS: {
    enabled: true,
    description: 'Multi-hop swap routing for better prices',
  },
  LIMIT_ORDERS: {
    enabled: false,
    description: 'Limit order functionality',
  },
  CROSS_CHAIN_SWAPS: {
    enabled: false,
    description: 'Cross-chain token swaps via bridges',
  },
  
  // Social features
  SOCIAL_SHARING: {
    enabled: true,
    description: 'Share portfolio and wrapped on social media',
  },
  REFERRAL_PROGRAM: {
    enabled: false,
    description: 'User referral program',
  },
  
  // Analytics
  ADVANCED_ANALYTICS: {
    enabled: true,
    description: 'Advanced portfolio analytics and insights',
  },
  PRICE_ALERTS: {
    enabled: false,
    description: 'Token price alerts and notifications',
  },
  
  // Experimental
  AI_TRADING_SUGGESTIONS: {
    enabled: false,
    description: 'AI-powered trading suggestions (experimental)',
  },
  DARK_MODE: {
    enabled: true,
    description: 'Dark mode theme',
  },
  MOBILE_APP: {
    enabled: true,
    description: 'Mobile-optimized experience',
  },
};

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  const feature = FEATURE_FLAGS[featureName];
  if (!feature) return false;
  
  return feature.enabled;
}

/**
 * Check if feature is enabled for specific chain
 */
export function isFeatureEnabledForChain(
  featureName: string,
  chainId: number
): boolean {
  const feature = FEATURE_FLAGS[featureName];
  if (!feature || !feature.enabled) return false;
  
  if (!feature.enabledForChains) return true;
  
  return feature.enabledForChains.includes(chainId);
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([, feature]) => feature.enabled)
    .map(([name]) => name);
}

/**
 * Get feature description
 */
export function getFeatureDescription(featureName: string): string {
  return FEATURE_FLAGS[featureName]?.description || '';
}

