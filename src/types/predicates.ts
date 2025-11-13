/**
 * Type predicates and utility functions
 * @module types/predicates
 */

import type { Token } from './token';
import type { TransactionStatus } from './blockchain';

/**
 * Check if transaction is pending
 */
export function isPendingTransaction(status: TransactionStatus): boolean {
  return status === 'pending';
}

/**
 * Check if transaction is confirmed
 */
export function isConfirmedTransaction(status: TransactionStatus): boolean {
  return status === 'confirmed';
}

/**
 * Check if transaction is failed
 */
export function isFailedTransaction(status: TransactionStatus): boolean {
  return status === 'failed';
}

/**
 * Check if tokens are equal
 */
export function areTokensEqual(a: Token, b: Token): boolean {
  return (
    a.address.toLowerCase() === b.address.toLowerCase() &&
    a.chainId === b.chainId
  );
}

/**
 * Check if amount is zero
 */
export function isZeroAmount(amount: string): boolean {
  return amount === '0' || amount === '0.0' || parseFloat(amount) === 0;
}

/**
 * Check if value is within range
 */
export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Check if timestamp is expired
 */
export function isExpired(timestamp: number, nowMs: number = Date.now()): boolean {
  return timestamp < nowMs;
}

/**
 * Check if slippage is high
 */
export function isHighSlippage(slippage: number, threshold: number = 5): boolean {
  return slippage > threshold;
}

/**
 * Check if price impact is significant
 */
export function isSignificantPriceImpact(priceImpact: number, threshold: number = 1): boolean {
  return Math.abs(priceImpact) > threshold;
}

