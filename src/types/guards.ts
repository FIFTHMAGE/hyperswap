/**
 * Runtime type guards
 * @module types/guards
 */

import type { Address, TxHash } from './blockchain';
import type { Token } from './token';

/**
 * Check if value is a valid Ethereum address
 */
export function isAddress(value: any): value is Address {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
}

/**
 * Check if value is a valid transaction hash
 */
export function isTxHash(value: any): value is TxHash {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value);
}

/**
 * Check if value is a Token
 */
export function isToken(value: any): value is Token {
  return (
    typeof value === 'object' &&
    value !== null &&
    isAddress(value.address) &&
    typeof value.decimals === 'number' &&
    typeof value.symbol === 'string' &&
    typeof value.name === 'string'
  );
}

/**
 * Check if value is a valid numeric string
 */
export function isNumericString(value: any): value is string {
  return typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '';
}

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is an error
 */
export function isError(value: any): value is Error {
  return value instanceof Error || (value && typeof value.message === 'string');
}

/**
 * Check if array has items
 */
export function hasItems<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Check if string is not empty
 */
export function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if object has specific property
 */
export function hasProperty<K extends PropertyKey>(
  obj: any,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

