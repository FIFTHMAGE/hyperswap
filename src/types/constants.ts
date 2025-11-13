/**
 * Type-related constants
 * @module types/constants
 */

import type { Address } from './blockchain';

/**
 * Zero address constant
 */
export const ZERO_ADDRESS: Address = '0x0000000000000000000000000000000000000000';

/**
 * Native token address (used by many protocols)
 */
export const NATIVE_TOKEN_ADDRESS: Address = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

/**
 * Max uint256 value (for unlimited approvals)
 */
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * Common token decimals
 */
export const COMMON_DECIMALS = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
  WBTC: 8,
} as const;

/**
 * Default pagination limit
 */
export const DEFAULT_PAGE_LIMIT = 20;

/**
 * Maximum pagination limit
 */
export const MAX_PAGE_LIMIT = 100;

/**
 * Default slippage tolerance (0.5%)
 */
export const DEFAULT_SLIPPAGE = 0.5;

/**
 * Default transaction deadline (20 minutes)
 */
export const DEFAULT_DEADLINE = 20;

/**
 * Gas buffer multiplier for estimates
 */
export const GAS_BUFFER_MULTIPLIER = 1.2;

