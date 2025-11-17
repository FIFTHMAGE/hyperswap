/**
 * Route constants
 * @module lib/constants
 */

export const ROUTES = {
  HOME: '/',
  SWAP: '/swap',
  LIQUIDITY: '/liquidity',
  PORTFOLIO: '/portfolio',
  WRAPPED: '/wrapped',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',

  // API routes
  API: {
    SWAP: '/api/swap',
    LIQUIDITY: '/api/liquidity',
    TOKENS: '/api/tokens',
    PRICES: '/api/prices',
    TRANSACTIONS: '/api/transactions',
    USER: '/api/user',
    AUTH: '/api/auth',
  },
} as const;

export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER];

export const PROTECTED_ROUTES = [ROUTES.PROFILE, ROUTES.PORTFOLIO, ROUTES.NOTIFICATIONS];

export const API_ROUTES = Object.values(ROUTES.API);
