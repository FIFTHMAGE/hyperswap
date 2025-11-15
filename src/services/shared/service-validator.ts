/**
 * Shared service validation utilities
 * Provides consistent validation across all services
 */

import { ValidationError } from './service-error-handler';

export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): T {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateAddress(address: string, fieldName: string = 'Address'): string {
  validateRequired(address, fieldName);
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new ValidationError(`${fieldName} must be a valid Ethereum address`);
  }
  
  return address;
}

export function validatePositiveNumber(
  value: number,
  fieldName: string = 'Value'
): number {
  validateRequired(value, fieldName);
  
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a number`);
  }
  
  if (value <= 0) {
    throw new ValidationError(`${fieldName} must be positive`);
  }
  
  return value;
}

export function validateChainId(chainId: number): number {
  validatePositiveNumber(chainId, 'Chain ID');
  
  const validChainIds = [1, 3, 4, 5, 42, 56, 137, 250, 42161, 43114, 10, 8453];
  if (!validChainIds.includes(chainId)) {
    throw new ValidationError(`Chain ID ${chainId} is not supported`);
  }
  
  return chainId;
}

export function validateArray<T>(
  value: T[],
  fieldName: string = 'Array',
  minLength: number = 1
): T[] {
  validateRequired(value, fieldName);
  
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`);
  }
  
  if (value.length < minLength) {
    throw new ValidationError(
      `${fieldName} must contain at least ${minLength} item(s)`
    );
  }
  
  return value;
}

export function validateEnum<T extends string>(
  value: T,
  allowedValues: readonly T[],
  fieldName: string = 'Value'
): T {
  validateRequired(value, fieldName);
  
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }
  
  return value;
}

export function validateTokenAmount(
  amount: string | number,
  decimals: number = 18
): string {
  const amountStr = typeof amount === 'number' ? amount.toString() : amount;
  validateRequired(amountStr, 'Token amount');
  
  const parsed = parseFloat(amountStr);
  if (isNaN(parsed) || parsed < 0) {
    throw new ValidationError('Token amount must be a valid positive number');
  }
  
  return amountStr;
}

