/**
 * Global error handler
 * @module lib/errors
 */

import { AppError } from './AppError';

export class ErrorHandler {
  /**
   * Handle application errors
   */
  static handle(error: Error): {
    message: string;
    statusCode: number;
    code?: string;
  } {
    if (error instanceof AppError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
      };
    }

    console.error('Unhandled error:', error);

    return {
      message: 'Internal server error',
      statusCode: 500,
    };
  }

  /**
   * Check if error is operational
   */
  static isOperational(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  /**
   * Log error
   */
  static log(error: Error): void {
    if (this.isOperational(error)) {
      console.warn('Operational error:', error.message);
    } else {
      console.error('Critical error:', error);
    }
  }
}
