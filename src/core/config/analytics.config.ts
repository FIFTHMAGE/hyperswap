/**
 * Analytics configuration
 * @module config/analytics
 */

export const ANALYTICS_CONFIG = {
  // Event tracking
  events: {
    swapInitiated: 'swap_initiated',
    swapCompleted: 'swap_completed',
    swapFailed: 'swap_failed',
    walletConnected: 'wallet_connected',
    walletDisconnected: 'wallet_disconnected',
    chainSwitched: 'chain_switched',
    tokenSelected: 'token_selected',
    liquidityAdded: 'liquidity_added',
    liquidityRemoved: 'liquidity_removed',
  },

  // User properties
  userProperties: {
    walletType: 'wallet_type',
    preferredChain: 'preferred_chain',
    tradingVolume: 'trading_volume',
    transactionCount: 'transaction_count',
  },

  // Sampling
  sampling: {
    errorRate: 1.0, // Track all errors
    eventRate: 1.0, // Track all events
    performanceRate: 0.1, // Sample 10% of performance metrics
  },

  // Privacy
  privacy: {
    anonymizeIp: true,
    respectDoNotTrack: true,
    cookieConsent: true,
  },
};
