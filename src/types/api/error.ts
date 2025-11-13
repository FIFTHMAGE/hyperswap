/**
 * API error types
 * @module types/api/error
 */

/**
 * Error severity level
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Error codes
 */
export enum ErrorCode {
  // Client errors (400s)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server errors (500s)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',

  // Business logic errors
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}

/**
 * Application error
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public severity: ErrorSeverity = 'error',
    public details?: any,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  constraint?: string;
  value?: any;
}

/**
 * Error context for debugging
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
  additionalInfo?: Record<string, any>;
}

