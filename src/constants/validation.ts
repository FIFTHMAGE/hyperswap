/**
 * Validation rules and limits
 * @module constants/validation
 */

/**
 * Address validation
 */
export const ADDRESS_VALIDATION = {
  ETHEREUM_LENGTH: 42,
  ETHEREUM_PREFIX: '0x',
  REGEX: /^0x[a-fA-F0-9]{40}$/,
} as const;

/**
 * Transaction hash validation
 */
export const TX_HASH_VALIDATION = {
  LENGTH: 66,
  PREFIX: '0x',
  REGEX: /^0x[a-fA-F0-9]{64}$/,
} as const;

/**
 * Amount validation limits
 */
export const AMOUNT_LIMITS = {
  MIN: '0',
  MAX: '1000000000000000000000000', // 1M tokens with 18 decimals
  MIN_DISPLAY: 0.000001,
} as const;

/**
 * Slippage validation
 */
export const SLIPPAGE_LIMITS = {
  MIN: 0.01, // 0.01%
  MAX: 50, // 50%
  DEFAULT: 0.5, // 0.5%
  WARNING_THRESHOLD: 5, // 5%
  PRESETS: [0.1, 0.5, 1.0, 3.0],
} as const;

/**
 * Deadline validation (minutes)
 */
export const DEADLINE_LIMITS = {
  MIN: 1,
  MAX: 4320, // 3 days
  DEFAULT: 20,
  PRESETS: [5, 10, 20, 30, 60],
} as const;

/**
 * Gas price limits (Gwei)
 */
export const GAS_LIMITS = {
  MIN_GWEI: 1,
  MAX_GWEI: 1000,
  DEFAULT_GAS_LIMIT: 200000,
  MIN_GAS_LIMIT: 21000,
  MAX_GAS_LIMIT: 10000000,
} as const;

/**
 * Input field validation
 */
export const INPUT_VALIDATION = {
  TOKEN_SYMBOL_MAX_LENGTH: 10,
  TOKEN_NAME_MAX_LENGTH: 50,
  SEARCH_MIN_LENGTH: 1,
  SEARCH_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

/**
 * Pagination limits
 */
export const PAGINATION_LIMITS = {
  MIN_PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * File upload limits
 */
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
} as const;

/**
 * Rate limiting
 */
export const RATE_LIMITS = {
  SEARCH_DEBOUNCE_MS: 300,
  PRICE_UPDATE_MS: 10000, // 10 seconds
  BALANCE_UPDATE_MS: 30000, // 30 seconds
  MAX_REQUESTS_PER_MINUTE: 60,
} as const;

