/**
 * Swap domain constants
 * @module core/constants/domain/swap
 */

/**
 * Default swap settings
 */
export const DEFAULT_SWAP_SETTINGS = {
  slippage: 0.5, // 0.5%
  deadline: 20, // 20 minutes
  multihop: true,
  expertMode: false,
} as const;

/**
 * Slippage presets
 */
export const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0, 3.0] as const;

/**
 * Maximum slippage allowed
 */
export const MAX_SLIPPAGE = 50; // 50%

/**
 * Minimum trade amount (in USD)
 */
export const MIN_TRADE_AMOUNT = 1;

/**
 * Maximum hops for multi-hop swaps
 */
export const MAX_SWAP_HOPS = 3;

/**
 * Swap status messages
 */
export const SWAP_STATUS_MESSAGES = {
  idle: 'Ready to swap',
  pending: 'Waiting for confirmation...',
  confirming: 'Transaction confirming...',
  success: 'Swap successful!',
  failed: 'Swap failed',
  cancelled: 'Swap cancelled',
} as const;
