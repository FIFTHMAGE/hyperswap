/**
 * Transaction validation utilities
 * @module utils/validation/transaction
 */

import { SLIPPAGE_LIMITS, DEADLINE_LIMITS, GAS_LIMITS } from '@/constants/validation';

/**
 * Validate slippage tolerance
 */
export function validateSlippage(slippage: number): {
  valid: boolean;
  error?: string;
  warning?: string;
} {
  if (slippage < SLIPPAGE_LIMITS.MIN) {
    return { valid: false, error: `Slippage must be at least ${SLIPPAGE_LIMITS.MIN}%` };
  }

  if (slippage > SLIPPAGE_LIMITS.MAX) {
    return { valid: false, error: `Slippage cannot exceed ${SLIPPAGE_LIMITS.MAX}%` };
  }

  if (slippage > SLIPPAGE_LIMITS.WARNING_THRESHOLD) {
    return {
      valid: true,
      warning: `High slippage (${slippage}%) may result in unfavorable rates`,
    };
  }

  return { valid: true };
}

/**
 * Validate transaction deadline
 */
export function validateDeadline(minutes: number): { valid: boolean; error?: string } {
  if (minutes < DEADLINE_LIMITS.MIN) {
    return { valid: false, error: `Deadline must be at least ${DEADLINE_LIMITS.MIN} minute` };
  }

  if (minutes > DEADLINE_LIMITS.MAX) {
    return { valid: false, error: `Deadline cannot exceed ${DEADLINE_LIMITS.MAX} minutes` };
  }

  return { valid: true };
}

/**
 * Validate gas price
 */
export function validateGasPrice(gwei: number): { valid: boolean; error?: string } {
  if (gwei < GAS_LIMITS.MIN_GWEI) {
    return { valid: false, error: `Gas price must be at least ${GAS_LIMITS.MIN_GWEI} Gwei` };
  }

  if (gwei > GAS_LIMITS.MAX_GWEI) {
    return { valid: false, error: `Gas price cannot exceed ${GAS_LIMITS.MAX_GWEI} Gwei` };
  }

  return { valid: true };
}

/**
 * Validate gas limit
 */
export function validateGasLimit(gasLimit: number): { valid: boolean; error?: string } {
  if (gasLimit < GAS_LIMITS.MIN_GAS_LIMIT) {
    return { valid: false, error: `Gas limit must be at least ${GAS_LIMITS.MIN_GAS_LIMIT}` };
  }

  if (gasLimit > GAS_LIMITS.MAX_GAS_LIMIT) {
    return { valid: false, error: `Gas limit cannot exceed ${GAS_LIMITS.MAX_GAS_LIMIT}` };
  }

  return { valid: true };
}

/**
 * Check if price impact is acceptable
 */
export function isPriceImpactAcceptable(impact: number, maxImpact: number = 5): boolean {
  return Math.abs(impact) <= maxImpact;
}

/**
 * Validate swap parameters
 */
export function validateSwapParams(params: {
  amountIn: string;
  amountOutMin: string;
  slippage: number;
  deadline: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!params.amountIn || parseFloat(params.amountIn) <= 0) {
    errors.push('Invalid input amount');
  }

  if (!params.amountOutMin || parseFloat(params.amountOutMin) <= 0) {
    errors.push('Invalid minimum output amount');
  }

  const slippageValidation = validateSlippage(params.slippage);
  if (!slippageValidation.valid) {
    errors.push(slippageValidation.error!);
  }

  const deadlineValidation = validateDeadline(params.deadline);
  if (!deadlineValidation.valid) {
    errors.push(deadlineValidation.error!);
  }

  return { valid: errors.length === 0, errors };
}
