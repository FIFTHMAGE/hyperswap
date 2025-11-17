/**
 * API endpoints constants
 */

export const API_ENDPOINTS = {
  // Pricing
  tokenPrices: '/api/tokens/prices',
  historicalPrices: '/api/tokens/prices/historical',

  // Swap
  swapQuote: '/api/swap/quote',
  swapExecute: '/api/swap/execute',
  swapHistory: '/api/swap/history',

  // Tokens
  tokenList: '/api/tokens/list',
  tokenBalance: '/api/tokens/balance',
  tokenSearch: '/api/tokens/search',

  // Pools
  poolList: '/api/pools/list',
  poolDetails: '/api/pools/:id',
  poolAnalytics: '/api/pools/:id/analytics',

  // Portfolio
  portfolio: '/api/portfolio',
  portfolioHistory: '/api/portfolio/history',
  transactions: '/api/transactions',

  // Wrapped
  wrappedData: '/api/wrapped/:address',
  wrappedExport: '/api/wrapped/:address/export',
} as const;

export const WS_ENDPOINTS = {
  prices: '/ws/prices',
  swaps: '/ws/swaps',
  portfolio: '/ws/portfolio',
} as const;
