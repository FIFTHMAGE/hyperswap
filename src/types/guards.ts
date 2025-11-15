/**
 * Type guard utilities for runtime type checking
 * @module guards
 */

import type { ApiResponse, ApiError } from './api.types';
import type { Address, Hash, Token, Chain, Transaction } from './blockchain.types';
import type { AppError } from './error.types';

// ============================================================================
// PRIMITIVE TYPE GUARDS
// ============================================================================

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Check if value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is an array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Check if value is a function
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Check if value is a promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise || (isObject(value) && isFunction((value as { then?: unknown }).then))
  );
}

/**
 * Check if value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// ============================================================================
// BLOCKCHAIN TYPE GUARDS
// ============================================================================

/**
 * Check if value is a valid Ethereum address
 */
export function isAddress(value: unknown): value is Address {
  return isString(value) && /^0x[0-9a-fA-F]{40}$/.test(value);
}

/**
 * Check if value is a valid transaction/block hash
 */
export function isHash(value: unknown): value is Hash {
  return isString(value) && /^0x[0-9a-fA-F]{64}$/.test(value);
}

/**
 * Check if value is a valid chain ID
 */
export function isChainId(value: unknown): value is number {
  return isNumber(value) && value > 0 && Number.isInteger(value);
}

/**
 * Check if value is a Token object
 */
export function isToken(value: unknown): value is Token {
  return (
    isObject(value) &&
    'address' in value &&
    isAddress(value.address) &&
    'chainId' in value &&
    isChainId(value.chainId) &&
    'decimals' in value &&
    isNumber(value.decimals) &&
    'symbol' in value &&
    isString(value.symbol) &&
    'name' in value &&
    isString(value.name)
  );
}

/**
 * Check if value is a Chain object
 */
export function isChain(value: unknown): value is Chain {
  return (
    isObject(value) &&
    'id' in value &&
    isChainId(value.id) &&
    'name' in value &&
    isString(value.name) &&
    'nativeCurrency' in value &&
    isObject(value.nativeCurrency)
  );
}

/**
 * Check if value is a Transaction object
 */
export function isTransaction(value: unknown): value is Transaction {
  return (
    isObject(value) &&
    'hash' in value &&
    isHash(value.hash) &&
    'from' in value &&
    isAddress(value.from) &&
    'chainId' in value &&
    isChainId(value.chainId)
  );
}

/**
 * Check if token is a native token (zero address)
 */
export function isNativeToken(token: Token): boolean {
  return token.address === '0x0000000000000000000000000000000000000000';
}

/**
 * Check if token is a wrapped token
 */
export function isWrappedToken(token: Token): boolean {
  return token.tags?.includes('wrapped') ?? false;
}

/**
 * Check if token is a stablecoin
 */
export function isStablecoin(token: Token): boolean {
  return token.tags?.includes('stablecoin') ?? false;
}

// ============================================================================
// API TYPE GUARDS
// ============================================================================

/**
 * Check if value is an ApiResponse
 */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    isObject(value) &&
    'success' in value &&
    isBoolean(value.success) &&
    'timestamp' in value &&
    isNumber(value.timestamp)
  );
}

/**
 * Check if ApiResponse is successful
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined;
}

/**
 * Check if ApiResponse is an error
 */
export function isApiError<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { error: ApiError } {
  return !response.success && response.error !== undefined;
}

/**
 * Check if value is an AppError
 */
export function isAppError(value: unknown): value is AppError {
  return (
    isObject(value) &&
    'code' in value &&
    isString(value.code) &&
    'message' in value &&
    isString(value.message) &&
    'category' in value &&
    'severity' in value &&
    'retryable' in value &&
    isBoolean(value.retryable)
  );
}

// ============================================================================
// VALIDATION TYPE GUARDS
// ============================================================================

/**
 * Check if string is a valid email
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if string is a valid URL
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a valid UUID
 */
export function isUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Check if value is a positive number
 */
export function isPositive(value: number): boolean {
  return isNumber(value) && value > 0;
}

/**
 * Check if value is a non-negative number
 */
export function isNonNegative(value: number): boolean {
  return isNumber(value) && value >= 0;
}

/**
 * Check if value is an integer
 */
export function isInteger(value: number): boolean {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * Check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return isNumber(value) && value >= min && value <= max;
}

// ============================================================================
// AMOUNT VALIDATION
// ============================================================================

/**
 * Check if string is a valid numeric amount
 */
export function isValidAmount(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value) && !isNaN(parseFloat(value));
}

/**
 * Check if amount is greater than zero
 */
export function isPositiveAmount(value: string): boolean {
  return isValidAmount(value) && parseFloat(value) > 0;
}

/**
 * Check if amount has valid decimals
 */
export function hasValidDecimals(value: string, maxDecimals: number): boolean {
  if (!isValidAmount(value)) return false;
  const decimals = value.split('.')[1];
  return !decimals || decimals.length <= maxDecimals;
}

// ============================================================================
// ARRAY TYPE GUARDS
// ============================================================================

/**
 * Check if all items in array match predicate
 */
export function isArrayOf<T>(
  value: unknown,
  predicate: (item: unknown) => item is T
): value is T[] {
  return isArray(value) && value.every(predicate);
}

/**
 * Check if array is non-empty
 */
export function isNonEmptyArray<T>(value: unknown): value is [T, ...T[]] {
  return isArray(value) && value.length > 0;
}

/**
 * Check if value is an array of strings
 */
export function isStringArray(value: unknown): value is string[] {
  return isArrayOf(value, isString);
}

/**
 * Check if value is an array of numbers
 */
export function isNumberArray(value: unknown): value is number[] {
  return isArrayOf(value, isNumber);
}

/**
 * Check if value is an array of addresses
 */
export function isAddressArray(value: unknown): value is Address[] {
  return isArrayOf(value, isAddress);
}

// ============================================================================
// OBJECT TYPE GUARDS
// ============================================================================

/**
 * Check if object has property
 */
export function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return isObject(obj) && key in obj;
}

/**
 * Check if object has all properties
 */
export function hasProperties<K extends string>(
  obj: unknown,
  keys: K[]
): obj is Record<K, unknown> {
  return isObject(obj) && keys.every((key) => key in obj);
}

/**
 * Check if object is empty
 */
export function isEmptyObject(obj: unknown): boolean {
  return isObject(obj) && Object.keys(obj).length === 0;
}

// ============================================================================
// NETWORK TYPE GUARDS
// ============================================================================

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!isError(error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('connection')
  );
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (!isError(error)) return false;
  return error.message.toLowerCase().includes('timeout');
}

/**
 * Check if error is an abort error
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

// ============================================================================
// BLOCKCHAIN ERROR TYPE GUARDS
// ============================================================================

/**
 * Check if error is a user rejection
 */
export function isUserRejection(error: unknown): boolean {
  if (!isError(error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('user rejected') || message.includes('user denied');
}

/**
 * Check if error is insufficient funds
 */
export function isInsufficientFunds(error: unknown): boolean {
  if (!isError(error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('insufficient funds') || message.includes('insufficient balance');
}

/**
 * Check if error is a gas estimation error
 */
export function isGasEstimationError(error: unknown): boolean {
  if (!isError(error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('gas') && (message.includes('estimation') || message.includes('required'))
  );
}

// ============================================================================
// TYPE NARROWING UTILITIES
// ============================================================================

/**
 * Assert value is defined (throws if nullish)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (isNullish(value)) {
    throw new Error(message ?? 'Value is null or undefined');
  }
}

/**
 * Assert value is an address (throws if invalid)
 */
export function assertAddress(value: unknown, message?: string): asserts value is Address {
  if (!isAddress(value)) {
    throw new Error(message ?? `Invalid address: ${value}`);
  }
}

/**
 * Assert value is a positive number (throws if invalid)
 */
export function assertPositive(value: unknown, message?: string): asserts value is number {
  if (!isNumber(value) || value <= 0) {
    throw new Error(message ?? `Value must be positive: ${value}`);
  }
}

/**
 * Narrow to non-null value
 */
export function nonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Filter out null and undefined values from array
 */
export function filterNullish<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(nonNull);
}
