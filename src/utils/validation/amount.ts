/**
 * Amount validation utilities
 * @module utils/validation/amount
 */

import { AMOUNT_LIMITS } from '@/constants/validation';

/**
 * Check if amount is valid number string
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || amount.trim() === '') return false;
  
  const num = parseFloat(amount);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Check if amount is greater than zero
 */
export function isPositiveAmount(amount: string): boolean {
  if (!isValidAmount(amount)) return false;
  return parseFloat(amount) > 0;
}

/**
 * Check if amount is within limits
 */
export function isWithinLimits(amount: string): boolean {
  if (!isValidAmount(amount)) return false;
  
  const num = parseFloat(amount);
  const min = parseFloat(AMOUNT_LIMITS.MIN);
  const max = parseFloat(AMOUNT_LIMITS.MAX);
  
  return num >= min && num <= max;
}

/**
 * Validate amount with balance check
 */
export function validateAmountWithBalance(
  amount: string,
  balance: string
): { valid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }
  
  if (!isValidAmount(amount)) {
    return { valid: false, error: 'Invalid amount format' };
  }
  
  if (!isPositiveAmount(amount)) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }
  
  if (parseFloat(amount) > parseFloat(balance)) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  if (!isWithinLimits(amount)) {
    return { valid: false, error: 'Amount exceeds limits' };
  }
  
  return { valid: true };
}

/**
 * Sanitize amount input (remove invalid characters)
 */
export function sanitizeAmountInput(input: string): string {
  // Remove everything except digits and decimal point
  let sanitized = input.replace(/[^\d.]/g, '');
  
  // Allow only one decimal point
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return sanitized;
}

/**
 * Format amount input for display
 */
export function formatAmountInput(input: string, decimals: number = 18): string {
  const sanitized = sanitizeAmountInput(input);
  
  if (!sanitized || sanitized === '.') return sanitized;
  
  const parts = sanitized.split('.');
  if (parts[1] && parts[1].length > decimals) {
    return parts[0] + '.' + parts[1].slice(0, decimals);
  }
  
  return sanitized;
}

