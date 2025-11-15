/**
 * Input validation service
 * @module services/validation
 */

import type { ValidationResult } from '@/types/validation.types';
import { isValidAddress, isValidAmount } from '@/utils/validation';

class InputValidatorService {
  /**
   * Validate swap inputs
   */
  validateSwap(data: {
    fromToken: string;
    toToken: string;
    amount: string;
    slippage: number;
  }): ValidationResult {
    const errors = [];

    if (!isValidAddress(data.fromToken)) {
      errors.push({
        field: 'fromToken',
        message: 'Invalid token address',
        code: 'invalid_address',
      });
    }

    if (!isValidAddress(data.toToken)) {
      errors.push({ field: 'toToken', message: 'Invalid token address', code: 'invalid_address' });
    }

    if (!isValidAmount(data.amount)) {
      errors.push({ field: 'amount', message: 'Invalid amount', code: 'invalid_amount' });
    }

    if (data.slippage < 0 || data.slippage > 50) {
      errors.push({
        field: 'slippage',
        message: 'Slippage must be between 0 and 50',
        code: 'invalid_slippage',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate address input
   */
  validateAddress(address: string): ValidationResult {
    const errors = [];

    if (!address) {
      errors.push({ field: 'address', message: 'Address is required', code: 'required' });
    } else if (!isValidAddress(address)) {
      errors.push({ field: 'address', message: 'Invalid address format', code: 'invalid_address' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate amount input
   */
  validateAmount(amount: string, balance?: string): ValidationResult {
    const errors = [];

    if (!amount) {
      errors.push({ field: 'amount', message: 'Amount is required', code: 'required' });
    } else if (!isValidAmount(amount)) {
      errors.push({ field: 'amount', message: 'Invalid amount format', code: 'invalid_amount' });
    } else if (balance && parseFloat(amount) > parseFloat(balance)) {
      errors.push({
        field: 'amount',
        message: 'Insufficient balance',
        code: 'insufficient_balance',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const inputValidator = new InputValidatorService();
