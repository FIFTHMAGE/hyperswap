/**
 * Portfolio domain constants
 * @module core/constants/domain/portfolio
 */

/**
 * Portfolio refresh intervals (ms)
 */
export const PORTFOLIO_REFRESH_INTERVAL = 30000; // 30 seconds

/**
 * Minimum portfolio value to display (USD)
 */
export const MIN_PORTFOLIO_VALUE = 0.01;

/**
 * Chart timeframes
 */
export const CHART_TIMEFRAMES = ['24h', '7d', '30d', '90d', '1y', 'all'] as const;

/**
 * Portfolio allocation colors
 */
export const ALLOCATION_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
] as const;

/**
 * Transaction types
 */
export const TRANSACTION_TYPES = {
  SWAP: 'swap',
  SEND: 'send',
  RECEIVE: 'receive',
  APPROVE: 'approve',
  LIQUIDITY_ADD: 'liquidity_add',
  LIQUIDITY_REMOVE: 'liquidity_remove',
} as const;
