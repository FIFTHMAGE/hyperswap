/**
 * Validation utilities barrel export
 * @module utils/validation
 */

export * from './address';
export * from './amount';
export * from './email';
export * from './url';
export * from './transaction';

// Common validation utilities
export {
  isValidAddress,
  isValidTxHash,
  isValidENS,
  normalizeAddress,
  validateAddress,
} from './address';

export {
  isValidAmount,
  isPositiveAmount,
  isWithinLimits,
  validateAmountWithBalance,
  sanitizeAmountInput,
  formatAmountInput,
} from './amount';

export {
  isValidEmail,
  isDisposableEmail,
  validateEmail,
  normalizeEmail,
  getEmailDomain,
} from './email';

export {
  isValidUrl,
  isValidUrlFast,
  isHttpsUrl,
  validateUrl,
  getUrlDomain,
  normalizeUrl,
} from './url';
