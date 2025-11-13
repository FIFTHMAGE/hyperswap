/**
 * Type helper utilities
 * @module types/helpers
 */

import type { Token } from './token';
import type { Address, ChainId } from './blockchain';

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: string, decimals: number): string {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = num / divisor;
  const fractionalPart = num % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  return `${integerPart}.${fractionalStr}`.replace(/\.?0+$/, '');
}

/**
 * Parse token amount to wei/smallest unit
 */
export function parseTokenAmount(amount: string, decimals: number): string {
  const [integer = '0', decimal = '0'] = amount.split('.');
  const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(integer) * BigInt(10 ** decimals) + BigInt(paddedDecimal)).toString();
}

/**
 * Create token key for caching
 */
export function getTokenKey(token: Token | Address, chainId?: ChainId): string {
  const address = typeof token === 'string' ? token : token.address;
  const chain = chainId ?? (typeof token === 'object' ? token.chainId : 1);
  return `${chain}:${address.toLowerCase()}`;
}

/**
 * Compare two addresses (case-insensitive)
 */
export function isSameAddress(a: Address | string, b: Address | string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Check if token is native currency
 */
export function isNativeToken(token: Token | Address): boolean {
  const address = typeof token === 'string' ? token : token.address;
  return address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ||
         address === '0x0000000000000000000000000000000000000000';
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: Address, startChars: number = 6, endChars: number = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Safe division (returns 0 if divisor is 0)
 */
export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

