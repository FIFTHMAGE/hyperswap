/**
 * Type guards for runtime type checking
 */

import { Address, Hash, Token } from './blockchain.types';

// Address type guard
export function isAddress(value: unknown): value is Address {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
}

// Hash type guard
export function isHash(value: unknown): value is Hash {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value);
}

// Token type guard
export function isToken(value: unknown): value is Token {
  if (typeof value !== 'object' || value === null) return false;
  const token = value as Token;
  return (
    isAddress(token.address) &&
    typeof token.chainId === 'number' &&
    typeof token.decimals === 'number' &&
    typeof token.symbol === 'string' &&
    typeof token.name === 'string'
  );
}

// String type guard
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Number type guard
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Array type guard
export function isArray<T>(value: unknown, itemGuard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (itemGuard) {
    return value.every(itemGuard);
  }
  return true;
}

// Object type guard
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Nullable type guard
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Error type guard
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// Promise type guard
export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (
    isObject(value) &&
    'then' in value &&
    typeof value.then === 'function'
  );
}

// Function type guard
export function isFunction(value: unknown): value is (...args: Parameters<typeof value>) => ReturnType<typeof value> {
  return typeof value === 'function';
}
