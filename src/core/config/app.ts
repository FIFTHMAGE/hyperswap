/**
 * App-wide configuration
 * @module config/app
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'HyperSwap',
  description: 'The ultimate multi-chain DEX aggregator',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  author: 'HyperSwap Team',
  keywords: ['defi', 'dex', 'swap', 'multi-chain', 'aggregator'],
} as const;

/**
 * Social links
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/hyperswap',
  github: 'https://github.com/hyperswap',
  discord: 'https://discord.gg/hyperswap',
  telegram: 'https://t.me/hyperswap',
  medium: 'https://medium.com/@hyperswap',
} as const;

/**
 * Contact information
 */
export const CONTACT_INFO = {
  email: 'support@hyperswap.io',
  support: 'https://support.hyperswap.io',
  docs: 'https://docs.hyperswap.io',
} as const;

/**
 * Legal links
 */
export const LEGAL_LINKS = {
  terms: '/terms',
  privacy: '/privacy',
  disclaimer: '/disclaimer',
} as const;

/**
 * Feature toggles (global)
 */
export const FEATURES = {
  enableSwap: true,
  enableLiquidity: true,
  enablePortfolio: true,
  enableWrapped: true,
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableNotifications: true,
  enableDarkMode: true,
} as const;

/**
 * Default settings
 */
export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  slippage: 0.5,
  deadline: 20,
  expertMode: false,
  showTestnets: false,
  defaultChain: 1,
  currency: 'USD' as const,
  language: 'en' as const,
} as const;
