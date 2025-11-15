/**
 * Validation type definitions and schemas
 * @module validation.types
 */

import type { Address } from './blockchain.types';

// ============================================================================
// VALIDATION RESULT
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Single validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
  value?: unknown;
}

/**
 * Validation error codes
 */
export type ValidationErrorCode =
  | 'required'
  | 'invalid_type'
  | 'invalid_format'
  | 'min_length'
  | 'max_length'
  | 'min_value'
  | 'max_value'
  | 'pattern_mismatch'
  | 'custom_validation'
  | 'invalid_address'
  | 'invalid_amount'
  | 'insufficient_balance'
  | 'invalid_slippage'
  | 'invalid_deadline';

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * String validation rules
 */
export interface StringValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  custom?: (value: string) => boolean | string;
}

/**
 * Number validation rules
 */
export interface NumberValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  custom?: (value: number) => boolean | string;
}

/**
 * Address validation rules
 */
export interface AddressValidationRules {
  required?: boolean;
  checksum?: boolean;
  allowZero?: boolean;
  custom?: (value: Address) => boolean | string;
}

/**
 * Amount validation rules
 */
export interface AmountValidationRules {
  required?: boolean;
  min?: string;
  max?: string;
  decimals?: number;
  positive?: boolean;
  custom?: (value: string) => boolean | string;
}

// ============================================================================
// FIELD VALIDATORS
// ============================================================================

/**
 * Generic field validator function
 */
export type FieldValidator<T> = (value: T) => ValidationResult | Promise<ValidationResult>;

/**
 * Validator configuration
 */
export interface ValidatorConfig<T> {
  validator: FieldValidator<T>;
  message?: string;
  when?: (formData: unknown) => boolean;
}

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

/**
 * Validation schema for form
 */
export type ValidationSchema<T> = {
  [K in keyof T]?: ValidatorConfig<T[K]>[];
};

/**
 * Schema validation result
 */
export type SchemaValidationResult<T> = {
  [K in keyof T]?: ValidationError[];
};

// ============================================================================
// BLOCKCHAIN-SPECIFIC VALIDATION
// ============================================================================

/**
 * Token amount validation
 */
export interface TokenAmountValidation {
  amount: string;
  decimals: number;
  balance?: string;
  minAmount?: string;
  maxAmount?: string;
}

/**
 * Slippage validation
 */
export interface SlippageValidation {
  slippage: number;
  minSlippage?: number;
  maxSlippage?: number;
  warningThreshold?: number;
}

/**
 * Gas validation
 */
export interface GasValidation {
  gasLimit: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  balance: string;
}

// ============================================================================
// SWAP VALIDATION
// ============================================================================

/**
 * Swap input validation
 */
export interface SwapValidationInput {
  fromToken: Address;
  toToken: Address;
  amount: string;
  slippage: number;
  deadline: number;
  userBalance: string;
}

/**
 * Swap validation result
 */
export interface SwapValidationResult extends ValidationResult {
  canExecute: boolean;
  warnings: ValidationWarning[];
}

/**
 * Validation warning (non-blocking)
 */
export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

// ============================================================================
// LIQUIDITY VALIDATION
// ============================================================================

/**
 * Add liquidity validation input
 */
export interface AddLiquidityValidationInput {
  token0: Address;
  token1: Address;
  amount0: string;
  amount1: string;
  balance0: string;
  balance1: string;
  slippage: number;
}

/**
 * Remove liquidity validation input
 */
export interface RemoveLiquidityValidationInput {
  lpToken: Address;
  amount: string;
  balance: string;
  minToken0: string;
  minToken1: string;
}

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

/**
 * Email validation
 */
export interface EmailValidation {
  email: string;
  allowDisposable?: boolean;
  requireVerification?: boolean;
}

/**
 * Password validation
 */
export interface PasswordValidation {
  password: string;
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

/**
 * URL validation
 */
export interface UrlValidation {
  url: string;
  allowedProtocols?: string[];
  requireProtocol?: boolean;
}

// ============================================================================
// VALIDATOR UTILITIES
// ============================================================================

/**
 * Validator function type
 */
export type Validator<T> = (
  value: T,
  context?: ValidationContext
) => ValidationResult | Promise<ValidationResult>;

/**
 * Validation context for complex validations
 */
export interface ValidationContext {
  formData: Record<string, unknown>;
  touched: Set<string>;
  errors: Record<string, ValidationError[]>;
}

/**
 * Validator chain for composing multiple validators
 */
export interface ValidatorChain<T> {
  validators: Validator<T>[];
  mode: 'all' | 'any';
  stopOnFirstError?: boolean;
}

// ============================================================================
// ASYNC VALIDATION
// ============================================================================

/**
 * Async validator for server-side validation
 */
export interface AsyncValidator<T> {
  validate: (value: T) => Promise<ValidationResult>;
  debounce?: number;
  cache?: boolean;
  cacheKey?: (value: T) => string;
}

/**
 * Async validation state
 */
export interface AsyncValidationState {
  validating: boolean;
  validated: boolean;
  result?: ValidationResult;
  error?: Error;
}

// ============================================================================
// VALIDATION RULES PRESETS
// ============================================================================

/**
 * Common validation rule presets
 */
export interface ValidationPresets {
  email: StringValidationRules;
  password: StringValidationRules;
  url: StringValidationRules;
  phone: StringValidationRules;
  zipCode: StringValidationRules;
  creditCard: StringValidationRules;
  ethereumAddress: AddressValidationRules;
  tokenAmount: AmountValidationRules;
  percentage: NumberValidationRules;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for validation result
 */
export function isValidationSuccess(
  result: ValidationResult
): result is ValidationResult & { valid: true } {
  return result.valid && result.errors.length === 0;
}

/**
 * Type guard for validation error
 */
export function hasValidationErrors(
  result: ValidationResult
): result is ValidationResult & { valid: false } {
  return !result.valid && result.errors.length > 0;
}
