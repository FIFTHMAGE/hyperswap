/**
 * Error handling type definitions
 * @module error.types
 */

import type { HttpStatusCode, ErrorCategory, ErrorSeverity } from './api.types';

// ============================================================================
// BASE ERROR TYPES
// ============================================================================

/**
 * Application error codes
 */
export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  OFFLINE_ERROR = 'OFFLINE_ERROR',

  // API errors
  API_ERROR = 'API_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  API_UNAVAILABLE = 'API_UNAVAILABLE',

  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',

  // Blockchain errors
  CHAIN_NOT_SUPPORTED = 'CHAIN_NOT_SUPPORTED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_REJECTED = 'WALLET_CONNECTION_REJECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_GAS = 'INSUFFICIENT_GAS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',

  // Swap errors
  QUOTE_EXPIRED = 'QUOTE_EXPIRED',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY',
  PRICE_IMPACT_TOO_HIGH = 'PRICE_IMPACT_TOO_HIGH',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',

  // Data errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  STALE_DATA = 'STALE_DATA',
  CACHE_ERROR = 'CACHE_ERROR',
}

/**
 * Base application error
 */
export interface AppError {
  code: ErrorCode | string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  statusCode?: HttpStatusCode;
  details?: ErrorDetails;
  stack?: string;
  timestamp: number;
  retryable: boolean;
  metadata?: ErrorMetadata;
}

/**
 * Additional error details
 */
export interface ErrorDetails {
  field?: string;
  expected?: unknown;
  received?: unknown;
  constraint?: string;
  context?: Record<string, unknown>;
}

/**
 * Error metadata for tracking and debugging
 */
export interface ErrorMetadata {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  chainId?: number;
  address?: string;
}

// ============================================================================
// SPECIFIC ERROR TYPES
// ============================================================================

/**
 * Network/API error
 */
export interface NetworkError extends AppError {
  category: 'network';
  endpoint?: string;
  method?: string;
  timeout?: number;
}

/**
 * Validation error with field-specific details
 */
export interface ValidationError extends AppError {
  category: 'validation';
  field: string;
  validationType: 'required' | 'format' | 'range' | 'custom';
  constraint?: string | number;
}

/**
 * Authentication/Authorization error
 */
export interface AuthError extends AppError {
  category: 'authentication' | 'authorization';
  reason: 'missing_token' | 'invalid_token' | 'expired_token' | 'insufficient_permissions';
  requiredPermissions?: string[];
}

/**
 * Blockchain/Web3 error
 */
export interface BlockchainError extends AppError {
  chainId?: number;
  transactionHash?: string;
  blockNumber?: number;
  contractAddress?: string;
  reason?: string;
  originalError?: Error;
}

/**
 * Swap/Trading error
 */
export interface SwapError extends AppError {
  fromToken?: string;
  toToken?: string;
  amount?: string;
  quoteId?: string;
  reason?: 'expired' | 'insufficient_liquidity' | 'high_slippage' | 'price_change';
}

// ============================================================================
// ERROR BOUNDARY TYPES
// ============================================================================

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error info from React error boundary
 */
export interface ErrorInfo {
  componentStack: string;
}

/**
 * Error boundary fallback props
 */
export interface ErrorBoundaryFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
}

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Error handler function type
 */
export type ErrorHandler = (error: AppError) => void | Promise<void>;

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  handler: ErrorHandler;
  filter?: (error: AppError) => boolean;
  priority?: number;
}

/**
 * Error recovery strategy
 */
export interface ErrorRecovery {
  strategy: 'retry' | 'fallback' | 'ignore' | 'alert';
  maxRetries?: number;
  retryDelay?: number;
  fallbackValue?: unknown;
  alertUser?: boolean;
}

// ============================================================================
// ERROR LOGGING
// ============================================================================

/**
 * Error log entry
 */
export interface ErrorLog {
  id: string;
  error: AppError;
  timestamp: number;
  userAgent: string;
  url: string;
  resolved: boolean;
  resolvedAt?: number;
}

/**
 * Error reporting configuration
 */
export interface ErrorReportingConfig {
  enabled: boolean;
  endpoint?: string;
  includeStack: boolean;
  includeMetadata: boolean;
  sampleRate: number;
  ignoreErrors?: ErrorCode[];
}

// ============================================================================
// ERROR TRANSFORMATION
// ============================================================================

/**
 * Error transformer function
 */
export type ErrorTransformer = (error: Error | unknown) => AppError;

/**
 * User-friendly error message
 */
export interface UserFriendlyError {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
}

// ============================================================================
// ERROR AGGREGATION
// ============================================================================

/**
 * Multiple errors aggregated
 */
export interface AggregatedError extends AppError {
  errors: AppError[];
  count: number;
}

/**
 * Error statistics
 */
export interface ErrorStatistics {
  total: number;
  byCategory: Record<ErrorCategory, number>;
  bySeverity: Record<ErrorSeverity, number>;
  byCode: Record<ErrorCode | string, number>;
  recent: ErrorLog[];
}

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

/**
 * Retry configuration for error recovery
 */
export interface RetryConfiguration {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: ErrorCode[];
  shouldRetry?: (error: AppError, attempt: number) => boolean;
}

/**
 * Retry state
 */
export interface RetryState {
  attempt: number;
  lastError: AppError | null;
  nextRetryAt: number | null;
  isRetrying: boolean;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'category' in error &&
    'severity' in error
  );
}

/**
 * Type guard for retryable error
 */
export function isRetryableError(error: AppError): boolean {
  return error.retryable === true;
}

/**
 * Type guard for critical error
 */
export function isCriticalError(error: AppError): boolean {
  return error.severity === 'critical';
}

/**
 * Type guard for network error
 */
export function isNetworkError(error: AppError): error is NetworkError {
  return error.category === 'network';
}

/**
 * Type guard for validation error
 */
export function isValidationError(error: AppError): error is ValidationError {
  return error.category === 'validation';
}

/**
 * Type guard for blockchain error
 */
export function isBlockchainError(error: AppError): error is BlockchainError {
  return 'chainId' in error || 'transactionHash' in error || 'contractAddress' in error;
}
