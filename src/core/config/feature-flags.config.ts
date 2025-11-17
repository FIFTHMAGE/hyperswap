/**
 * Feature flags configuration
 * @module config/feature-flags
 */

export const FEATURE_FLAGS = {
  // Core features
  swapEnabled: true,
  liquidityEnabled: true,
  portfolioEnabled: true,
  wrappedEnabled: true,

  // Advanced features
  limitOrdersEnabled: false,
  bridgeEnabled: false,
  fiatRampEnabled: false,
  nftSwapEnabled: false,

  // Analytics
  analyticsEnabled: true,
  sentryEnabled: false,
  mixpanelEnabled: false,

  // Performance
  virtualScrollEnabled: true,
  prefetchingEnabled: true,
  serviceWorkerEnabled: true,

  // UI features
  darkModeEnabled: true,
  i18nEnabled: false,
  soundEffectsEnabled: false,

  // Beta features
  betaFeaturesEnabled: false,
  experimentalRoutingEnabled: false,

  // Mobile
  pwaEnabled: true,
  offlineModeEnabled: true,
  pushNotificationsEnabled: false,

  // Security
  mevProtectionEnabled: true,
  simulationEnabled: false,
};

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURE_FLAGS[feature] ?? false;
}
