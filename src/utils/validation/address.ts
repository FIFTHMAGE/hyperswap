/**
 * Address validation utilities
 * @module utils/validation/address
 */

import { ADDRESS_VALIDATION, TX_HASH_VALIDATION } from '@/constants/validation';

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  if (!address) return false;
  return ADDRESS_VALIDATION.REGEX.test(address);
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  if (!hash) return false;
  return TX_HASH_VALIDATION.REGEX.test(hash);
}

/**
 * Validate ENS name format
 */
export function isValidENS(name: string): boolean {
  if (!name) return false;
  return /^[a-z0-9-]+\.eth$/.test(name);
}

/**
 * Check if string is an address or ENS
 */
export function isAddressOrENS(input: string): boolean {
  return isValidAddress(input) || isValidENS(input);
}

/**
 * Normalize address to lowercase
 */
export function normalizeAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error('Invalid address format');
  }
  return address.toLowerCase();
}

/**
 * Validate address with error message
 */
export function validateAddress(address: string): { valid: boolean; error?: string } {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }
  
  if (!ADDRESS_VALIDATION.ETHEREUM_PREFIX) {
    return { valid: false, error: 'Address must start with 0x' };
  }
  
  if (address.length !== ADDRESS_VALIDATION.ETHEREUM_LENGTH) {
    return { valid: false, error: 'Address must be 42 characters long' };
  }
  
  if (!isValidAddress(address)) {
    return { valid: false, error: 'Invalid address format' };
  }
  
  return { valid: true };
}

