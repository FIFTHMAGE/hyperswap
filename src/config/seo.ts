/**
 * SEO metadata configuration
 * @module config/seo
 */

import { APP_CONFIG } from './app';

/**
 * Default SEO metadata
 */
export const DEFAULT_SEO = {
  title: APP_CONFIG.name,
  titleTemplate: `%s | ${APP_CONFIG.name}`,
  defaultTitle: `${APP_CONFIG.name} - ${APP_CONFIG.description}`,
  description: APP_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    images: [
      {
        url: `${APP_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: APP_CONFIG.name,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@hyperswap',
    site: '@hyperswap',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'keywords',
      content: APP_CONFIG.keywords.join(', '),
    },
    {
      name: 'author',
      content: APP_CONFIG.author,
    },
    {
      name: 'theme-color',
      content: '#3b82f6',
    },
    {
      name: 'application-name',
      content: APP_CONFIG.name,
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: APP_CONFIG.name,
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
} as const;

/**
 * Page-specific SEO configurations
 */
export const PAGE_SEO = {
  swap: {
    title: 'Swap Tokens',
    description: 'Swap tokens instantly across multiple blockchains with the best rates',
    openGraph: {
      title: 'Swap Tokens on HyperSwap',
      description: 'Get the best rates for token swaps across Ethereum, Polygon, Arbitrum, and more',
    },
  },
  liquidity: {
    title: 'Liquidity Pools',
    description: 'Discover and manage liquidity pools across multiple DEX protocols',
    openGraph: {
      title: 'Liquidity Pools - HyperSwap',
      description: 'Track your liquidity positions and find the best pools for earning yield',
    },
  },
  portfolio: {
    title: 'Portfolio',
    description: 'Track your crypto portfolio across all chains in one place',
    openGraph: {
      title: 'Portfolio Tracker - HyperSwap',
      description: 'Monitor your assets, transactions, and portfolio performance across multiple blockchains',
    },
  },
  wrapped: {
    title: 'Year Wrapped',
    description: 'Your DeFi year in review - see your crypto journey',
    openGraph: {
      title: 'Your Crypto Year Wrapped - HyperSwap',
      description: 'Discover your DeFi stats, favorite tokens, and trading patterns from the past year',
    },
  },
} as const;

/**
 * JSON-LD structured data
 */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: APP_CONFIG.name,
  description: APP_CONFIG.description,
  url: APP_CONFIG.url,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: APP_CONFIG.author,
  },
} as const;

/**
 * Get SEO config for a specific page
 */
export function getPageSEO(page: keyof typeof PAGE_SEO) {
  return {
    ...DEFAULT_SEO,
    ...PAGE_SEO[page],
  };
}

