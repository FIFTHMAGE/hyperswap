/**
 * Advanced feature flags management system
 * @module config/features.config
 */

import { getEnv } from './env';

/**
 * Feature flag metadata
 */
export interface FeatureMetadata {
  /** Feature name */
  name: string;
  /** Feature description */
  description: string;
  /** Whether the feature is enabled */
  enabled: boolean;
  /** Chains where this feature is available (empty = all chains) */
  enabledForChains?: number[];
  /** Minimum app version required */
  minimumVersion?: string;
  /** Beta/experimental flag */
  isBeta?: boolean;
  /** Feature dependencies */
  dependencies?: string[];
  /** Environment where feature is available */
  environments?: ('development' | 'production' | 'test')[];
}

/**
 * Feature flags registry
 */
export const FEATURES: Record<string, FeatureMetadata> = {
  // Core features
  SWAP: {
    name: 'Token Swaps',
    description: 'Token swapping functionality across all supported DEXes',
    enabled: true,
  },

  LIQUIDITY_POOLS: {
    name: 'Liquidity Pools',
    description: 'Liquidity pool discovery, analytics, and management',
    enabled: true,
  },

  PORTFOLIO_TRACKING: {
    name: 'Portfolio Tracking',
    description: 'Multi-chain portfolio value tracking and analytics',
    enabled: true,
  },

  YEAR_WRAPPED: {
    name: 'Year Wrapped',
    description: 'Annual blockchain activity summary and insights',
    enabled: true,
    environments: ['production', 'development'],
  },

  // Advanced trading features
  MULTI_HOP_SWAPS: {
    name: 'Multi-hop Swaps',
    description: 'Automatic multi-hop routing for optimal swap prices',
    enabled: true,
    dependencies: ['SWAP'],
  },

  LIMIT_ORDERS: {
    name: 'Limit Orders',
    description: 'Place limit orders for token swaps',
    enabled: false,
    isBeta: true,
    dependencies: ['SWAP'],
  },

  CROSS_CHAIN_SWAPS: {
    name: 'Cross-chain Swaps',
    description: 'Token swaps across different blockchains',
    enabled: false,
    isBeta: true,
    dependencies: ['SWAP'],
    minimumVersion: '2.0.0',
  },

  MEV_PROTECTION: {
    name: 'MEV Protection',
    description: 'Protection against MEV attacks and frontrunning',
    enabled: true,
    dependencies: ['SWAP'],
    enabledForChains: [1, 137, 42161, 10], // Ethereum, Polygon, Arbitrum, Optimism
  },

  // Social & sharing
  SOCIAL_SHARING: {
    name: 'Social Sharing',
    description: 'Share portfolio stats and wrapped summaries on social media',
    enabled: true,
  },

  REFERRAL_PROGRAM: {
    name: 'Referral Program',
    description: 'Earn rewards by referring new users',
    enabled: false,
    environments: ['production'],
  },

  // Analytics & monitoring
  ADVANCED_ANALYTICS: {
    name: 'Advanced Analytics',
    description: 'Detailed portfolio analytics, insights, and trends',
    enabled: true,
    dependencies: ['PORTFOLIO_TRACKING'],
  },

  PRICE_ALERTS: {
    name: 'Price Alerts',
    description: 'Real-time price notifications for tracked tokens',
    enabled: false,
    isBeta: true,
  },

  TRANSACTION_HISTORY: {
    name: 'Transaction History',
    description: 'Detailed transaction history across all chains',
    enabled: true,
  },

  // Real-time features
  REALTIME_PRICES: {
    name: 'Real-time Prices',
    description: 'Live price updates via WebSocket',
    enabled: true,
  },

  REALTIME_PORTFOLIO: {
    name: 'Real-time Portfolio',
    description: 'Live portfolio value updates',
    enabled: true,
    dependencies: ['PORTFOLIO_TRACKING', 'REALTIME_PRICES'],
  },

  // UI/UX features
  DARK_MODE: {
    name: 'Dark Mode',
    description: 'Dark theme for better viewing in low light',
    enabled: true,
  },

  MOBILE_OPTIMIZED: {
    name: 'Mobile Optimization',
    description: 'Enhanced mobile experience with touch gestures',
    enabled: true,
  },

  PWA_SUPPORT: {
    name: 'Progressive Web App',
    description: 'Install as standalone app with offline support',
    enabled: true,
    environments: ['production'],
  },

  // Experimental features
  AI_TRADING_SUGGESTIONS: {
    name: 'AI Trading Suggestions',
    description: 'AI-powered trading recommendations (experimental)',
    enabled: false,
    isBeta: true,
    environments: ['development'],
  },

  GAS_OPTIMIZATION: {
    name: 'Gas Optimization',
    description: 'Automatic gas price optimization for transactions',
    enabled: true,
    dependencies: ['SWAP'],
  },

  BATCH_TRANSACTIONS: {
    name: 'Batch Transactions',
    description: 'Execute multiple transactions in a single batch',
    enabled: false,
    isBeta: true,
    enabledForChains: [1, 137, 42161, 10],
  },
};

/**
 * Feature flag manager class
 */
export class FeatureManager {
  private static instance: FeatureManager;
  private overrides: Map<string, boolean> = new Map();

  private constructor() {}

  static getInstance(): FeatureManager {
    if (!FeatureManager.instance) {
      FeatureManager.instance = new FeatureManager();
    }
    return FeatureManager.instance;
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(featureName: string): boolean {
    // Check for override first
    if (this.overrides.has(featureName)) {
      return this.overrides.get(featureName)!;
    }

    const feature = FEATURES[featureName];
    if (!feature) {
      console.warn(`Unknown feature flag: ${featureName}`);
      return false;
    }

    // Check environment restriction
    if (feature.environments) {
      const env = getEnv().NODE_ENV;
      if (!feature.environments.includes(env)) {
        return false;
      }
    }

    // Check dependencies
    if (feature.dependencies) {
      const allDependenciesEnabled = feature.dependencies.every((dep) => this.isEnabled(dep));
      if (!allDependenciesEnabled) {
        return false;
      }
    }

    return feature.enabled;
  }

  /**
   * Check if feature is enabled for specific chain
   */
  isEnabledForChain(featureName: string, chainId: number): boolean {
    if (!this.isEnabled(featureName)) {
      return false;
    }

    const feature = FEATURES[featureName];
    if (!feature.enabledForChains) {
      return true; // No chain restriction
    }

    return feature.enabledForChains.includes(chainId);
  }

  /**
   * Get feature metadata
   */
  getFeature(featureName: string): FeatureMetadata | undefined {
    return FEATURES[featureName];
  }

  /**
   * Get all enabled features
   */
  getEnabledFeatures(): string[] {
    return Object.keys(FEATURES).filter((name) => this.isEnabled(name));
  }

  /**
   * Get beta features
   */
  getBetaFeatures(): string[] {
    return Object.entries(FEATURES)
      .filter(([, feature]) => feature.isBeta)
      .map(([name]) => name);
  }

  /**
   * Override feature flag (for testing/debugging)
   */
  override(featureName: string, enabled: boolean): void {
    this.overrides.set(featureName, enabled);
  }

  /**
   * Clear override
   */
  clearOverride(featureName: string): void {
    this.overrides.delete(featureName);
  }

  /**
   * Clear all overrides
   */
  clearAllOverrides(): void {
    this.overrides.clear();
  }

  /**
   * Get feature summary
   */
  getSummary() {
    const enabled = this.getEnabledFeatures();
    const beta = this.getBetaFeatures();
    const total = Object.keys(FEATURES).length;

    return {
      total,
      enabled: enabled.length,
      disabled: total - enabled.length,
      beta: beta.length,
      features: enabled,
    };
  }
}

/**
 * Global feature manager instance
 */
const featureManager = FeatureManager.getInstance();

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  return featureManager.isEnabled(featureName);
}

/**
 * Check if feature is enabled for specific chain
 */
export function isFeatureEnabledForChain(featureName: string, chainId: number): boolean {
  return featureManager.isEnabledForChain(featureName, chainId);
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  return featureManager.getEnabledFeatures();
}

/**
 * Get feature description
 */
export function getFeatureDescription(featureName: string): string {
  return featureManager.getFeature(featureName)?.description || '';
}

/**
 * Get feature metadata
 */
export function getFeatureMetadata(featureName: string): FeatureMetadata | undefined {
  return featureManager.getFeature(featureName);
}

/**
 * Get beta features
 */
export function getBetaFeatures(): string[] {
  return featureManager.getBetaFeatures();
}

/**
 * Override feature (for testing/debugging)
 */
export function overrideFeature(featureName: string, enabled: boolean): void {
  featureManager.override(featureName, enabled);
}

/**
 * Get feature summary
 */
export function getFeatureSummary() {
  return featureManager.getSummary();
}

/**
 * Export feature manager for advanced usage
 */
export { featureManager };
