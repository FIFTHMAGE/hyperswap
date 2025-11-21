/**
 * Application constants
 * @module utils
 */

export const APP_NAME = 'HyperSwap';
export const APP_VERSION = '1.0.0';

export const DEFAULT_SLIPPAGE = 0.5;
export const MAX_SLIPPAGE = 50;
export const MIN_SLIPPAGE = 0.1;

export const DEFAULT_DEADLINE = 20;
export const MAX_DEADLINE = 60;
export const MIN_DEADLINE = 5;

export const REFRESH_INTERVAL = 15000;
export const PRICE_UPDATE_INTERVAL = 10000;
export const BALANCE_UPDATE_INTERVAL = 30000;

export const MAX_TOKEN_DECIMALS = 18;
export const DEFAULT_TOKEN_DECIMALS = 18;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export const NOTIFICATION_DURATION = {
  SUCCESS: 5000,
  ERROR: 8000,
  WARNING: 6000,
  INFO: 4000,
} as const;

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'hyperswap_settings',
  FAVORITES: 'hyperswap_favorites',
  HISTORY: 'hyperswap_history',
  THEME: 'hyperswap_theme',
} as const;
