/**
 * ErrorHandler - Centralized error handling
 * @module features/errors
 */

import { Logger } from '../../utils/logger';
import { notificationManager } from '../notifications/NotificationManager';

const logger = new Logger('ErrorHandler');

export enum ErrorCode {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_ALLOWANCE = 'INSUFFICIENT_ALLOWANCE',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  DEADLINE_EXCEEDED = 'DEADLINE_EXCEEDED',
  PRICE_IMPACT_TOO_HIGH = 'PRICE_IMPACT_TOO_HIGH',
  LIQUIDITY_INSUFFICIENT = 'LIQUIDITY_INSUFFICIENT',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  originalError?: Error;
}

export class ErrorHandler {
  /**
   * Handle error and show notification
   */
  static handle(error: any): AppError {
    const appError = this.parseError(error);

    logger.error(
      `Error [${appError.code}]:`,
      appError.originalError || new Error(appError.message)
    );

    // Show user-friendly notification
    notificationManager.error(this.getErrorTitle(appError.code), appError.message, 8000);

    return appError;
  }

  /**
   * Parse error into AppError
   */
  private static parseError(error: any): AppError {
    // User rejected transaction
    if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
      return {
        code: ErrorCode.TRANSACTION_REJECTED,
        message: 'Transaction was rejected by user',
        originalError: error,
      };
    }

    // Insufficient balance
    if (error?.message?.includes('insufficient funds') || error?.code === 'INSUFFICIENT_FUNDS') {
      return {
        code: ErrorCode.INSUFFICIENT_BALANCE,
        message: 'Insufficient balance to complete this transaction',
        originalError: error,
      };
    }

    // Network error
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Network connection error. Please check your internet connection',
        originalError: error,
      };
    }

    // Slippage exceeded
    if (
      error?.message?.includes('slippage') ||
      error?.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')
    ) {
      return {
        code: ErrorCode.SLIPPAGE_EXCEEDED,
        message: 'Price moved too much. Try increasing slippage tolerance',
        originalError: error,
      };
    }

    // Deadline exceeded
    if (error?.message?.includes('deadline') || error?.message?.includes('EXPIRED')) {
      return {
        code: ErrorCode.DEADLINE_EXCEEDED,
        message: 'Transaction deadline exceeded. Please try again',
        originalError: error,
      };
    }

    // Insufficient liquidity
    if (
      error?.message?.includes('liquidity') ||
      error?.message?.includes('INSUFFICIENT_LIQUIDITY')
    ) {
      return {
        code: ErrorCode.LIQUIDITY_INSUFFICIENT,
        message: 'Insufficient liquidity for this trade',
        originalError: error,
      };
    }

    // Transaction failed
    if (error?.code === 'CALL_EXCEPTION' || error?.receipt?.status === 0) {
      return {
        code: ErrorCode.TRANSACTION_FAILED,
        message: 'Transaction failed. Please try again',
        details: error?.reason || error?.message,
        originalError: error,
      };
    }

    // Default unknown error
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error?.message || 'An unexpected error occurred',
      originalError: error,
    };
  }

  /**
   * Get user-friendly error title
   */
  private static getErrorTitle(code: ErrorCode): string {
    const titles: Record<ErrorCode, string> = {
      [ErrorCode.WALLET_NOT_CONNECTED]: 'Wallet Not Connected',
      [ErrorCode.INSUFFICIENT_BALANCE]: 'Insufficient Balance',
      [ErrorCode.INSUFFICIENT_ALLOWANCE]: 'Insufficient Allowance',
      [ErrorCode.TRANSACTION_REJECTED]: 'Transaction Rejected',
      [ErrorCode.TRANSACTION_FAILED]: 'Transaction Failed',
      [ErrorCode.NETWORK_ERROR]: 'Network Error',
      [ErrorCode.INVALID_ADDRESS]: 'Invalid Address',
      [ErrorCode.INVALID_AMOUNT]: 'Invalid Amount',
      [ErrorCode.SLIPPAGE_EXCEEDED]: 'Slippage Exceeded',
      [ErrorCode.DEADLINE_EXCEEDED]: 'Deadline Exceeded',
      [ErrorCode.PRICE_IMPACT_TOO_HIGH]: 'High Price Impact',
      [ErrorCode.LIQUIDITY_INSUFFICIENT]: 'Insufficient Liquidity',
      [ErrorCode.TOKEN_NOT_FOUND]: 'Token Not Found',
      [ErrorCode.UNKNOWN_ERROR]: 'Error',
    };

    return titles[code] || 'Error';
  }

  /**
   * Create custom error
   */
  static createError(code: ErrorCode, message: string, details?: string): AppError {
    return {
      code,
      message,
      details,
    };
  }

  /**
   * Handle and rethrow error
   */
  static handleAndThrow(error: any): never {
    const appError = this.handle(error);
    throw appError;
  }
}
