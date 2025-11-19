/**
 * Configuration barrel export
 * @module config
 */

// Environment configuration (must be first)
export * from './validation';
export * from './env';

// Feature flags
export * from './features';
export * from './features.config';
export * from './feature-flags.config';

// Application configuration
export * from './api';
export * from './app';

// Chain configuration
export * from './chains.config';
export * from './chains';

// Performance & caching
export * from './performance.config';
export * from './cache.config';

// Network & tokens
export * from './network.config';
export * from './tokens.config';
export * from './dex.config';

// UI configuration
export * from './theme';
export * from './seo';

// Analytics
export * from './analytics.config';

// Legacy exports (to be refactored)
export * from './env.config';
