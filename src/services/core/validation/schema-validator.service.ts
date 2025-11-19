/**
 * Schema validation service with Zod
 * @module services/validation/schema-validator
 */

import { z } from 'zod';
import {
  AddressSchema,
  AmountSchema,
  SlippageSchema,
  DeadlineSchema,
} from '@/types/validators';

/**
 * Validate swap parameters
 */
export function validateSwapParams(params: {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
  deadline: number;
}): { valid: boolean; errors?: Record<string, string> } {
  const schema = z.object({
    fromToken: AddressSchema,
    toToken: AddressSchema,
    amount: AmountSchema,
    slippage: SlippageSchema,
    deadline: DeadlineSchema,
  });

  const result = schema.safeParse(params);

  if (result.success) {
    return { valid: true };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const field = err.path[0] as string;
    errors[field] = err.message;
  });

  return { valid: false, errors };
}

/**
 * Validate address
 */
export function validateAddress(address: string): {
  valid: boolean;
  error?: string;
} {
  const result = AddressSchema.safeParse(address);

  if (result.success) {
    return { valid: true };
  }

  return {
    valid: false,
    error: result.error.errors[0]?.message || 'Invalid address',
  };
}

/**
 * Validate amount
 */
export function validateAmount(amount: string): {
  valid: boolean;
  error?: string;
} {
  const result = AmountSchema.safeParse(amount);

  if (result.success) {
    return { valid: true };
  }

  return {
    valid: false,
    error: result.error.errors[0]?.message || 'Invalid amount',
  };
}

/**
 * Validate slippage
 */
export function validateSlippage(slippage: number): {
  valid: boolean;
  error?: string;
} {
  const result = SlippageSchema.safeParse(slippage);

  if (result.success) {
    return { valid: true };
  }

  return {
    valid: false,
    error: result.error.errors[0]?.message || 'Invalid slippage',
  };
}

/**
 * Validate multiple addresses
 */
export function validateAddresses(addresses: string[]): {
  valid: boolean;
  invalidAddresses?: string[];
} {
  const invalid = addresses.filter((addr) => {
    const result = AddressSchema.safeParse(addr);
    return !result.success;
  });

  if (invalid.length === 0) {
    return { valid: true };
  }

  return {
    valid: false,
    invalidAddresses: invalid,
  };
}

