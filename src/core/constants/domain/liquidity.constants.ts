/**
 * Liquidity domain constants
 * @module core/constants/domain/liquidity
 */

/**
 * Minimum liquidity (USD) to show pool
 */
export const MIN_LIQUIDITY_USD = 1000;

/**
 * Pool sorting options
 */
export const POOL_SORT_OPTIONS = ['tvl', 'volume', 'apy', 'fees'] as const;

/**
 * APY calculation periods
 */
export const APY_PERIODS = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
  YEARLY: 365,
} as const;

/**
 * Default pool filters
 */
export const DEFAULT_POOL_FILTERS = {
  minTVL: 0,
  minVolume: 0,
  minAPY: 0,
  protocols: [],
} as const;

/**
 * IL warning thresholds
 */
export const IL_WARNING_THRESHOLDS = {
  LOW: 2, // 2%
  MEDIUM: 5, // 5%
  HIGH: 10, // 10%
  CRITICAL: 20, // 20%
} as const;
