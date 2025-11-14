/**
 * Error handler service with Sentry integration support
 * @module services/error/error-handler
 */

import { isDevelopment } from '@/config/env';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Handle and log errors
 */
export function handleError(error: Error, context?: ErrorContext): void {
  // Log to console in development
  if (isDevelopment()) {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
  }

  // TODO: Send to Sentry in production
  // if (isProduction() && process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true') {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }
}

/**
 * Handle async errors
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  context?: ErrorContext
): Promise<[Error | null, T | null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    handleError(error as Error, context);
    return [error as Error, null];
  }
}

/**
 * Create error from API response
 */
export function createAPIError(
  message: string,
  statusCode?: number,
  data?: any
): Error {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  error.data = data;
  return error;
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('network') ||
    error.message.includes('fetch') ||
    error.message.includes('ECONNREFUSED')
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error): string {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for this transaction.';
  }

  if (error.message.includes('user rejected')) {
    return 'Transaction was cancelled.';
  }

  return error.message || 'An unexpected error occurred.';
}

