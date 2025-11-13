/**
 * Runtime validation schemas (to be used with Zod when installed)
 * @module types/validators
 */

/**
 * Address validation regex
 */
export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

/**
 * Transaction hash regex
 */
export const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

/**
 * Validation rules
 */
export const ValidationRules = {
  address: {
    pattern: ADDRESS_REGEX,
    message: 'Invalid Ethereum address format',
  },
  txHash: {
    pattern: TX_HASH_REGEX,
    message: 'Invalid transaction hash format',
  },
  amount: {
    min: 0,
    message: 'Amount must be positive',
  },
  slippage: {
    min: 0.01,
    max: 50,
    message: 'Slippage must be between 0.01% and 50%',
  },
  deadline: {
    min: 1,
    max: 4320, // 3 days in minutes
    message: 'Deadline must be between 1 minute and 3 days',
  },
} as const;

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): {
  valid: boolean;
  error?: string;
} {
  if (!address || typeof address !== 'string') {
    return { valid: false, error: 'Address is required' };
  }
  
  if (!ADDRESS_REGEX.test(address)) {
    return { valid: false, error: ValidationRules.address.message };
  }
  
  return { valid: true };
}

/**
 * Validate amount
 */
export function validateAmount(amount: string | number): {
  valid: boolean;
  error?: string;
} {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return { valid: false, error: 'Invalid amount format' };
  }
  
  if (num < ValidationRules.amount.min) {
    return { valid: false, error: ValidationRules.amount.message };
  }
  
  return { valid: true };
}

/**
 * Validate slippage
 */
export function validateSlippage(slippage: number): {
  valid: boolean;
  error?: string;
} {
  if (slippage < ValidationRules.slippage.min || slippage > ValidationRules.slippage.max) {
    return { valid: false, error: ValidationRules.slippage.message };
  }
  
  return { valid: true };
}

/**
 * Validate deadline
 */
export function validateDeadline(deadline: number): {
  valid: boolean;
  error?: string;
} {
  if (deadline < ValidationRules.deadline.min || deadline > ValidationRules.deadline.max) {
    return { valid: false, error: ValidationRules.deadline.message };
  }
  
  return { valid: true };
}

