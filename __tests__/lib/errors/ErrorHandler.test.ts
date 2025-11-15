/**
 * ErrorHandler tests
 */

import { AppError } from '@/lib/errors/AppError';
import { ErrorHandler } from '@/lib/errors/ErrorHandler';

describe('ErrorHandler', () => {
  describe('handle', () => {
    test('handles AppError', () => {
      const error = new AppError('NETWORK_ERROR', 'Test', 503);
      const result = ErrorHandler.handle(error);

      expect(result).toEqual({
        message: 'Test',
        statusCode: 503,
        code: 'NETWORK_ERROR',
      });
    });

    test('handles generic Error', () => {
      const error = new Error('Generic error');
      const result = ErrorHandler.handle(error);

      expect(result).toEqual({
        message: 'Internal server error',
        statusCode: 500,
      });
    });
  });

  describe('isOperational', () => {
    test('identifies operational errors', () => {
      const error = new AppError('INVALID_INPUT', 'Test', 400, true);
      expect(ErrorHandler.isOperational(error)).toBe(true);
    });

    test('identifies non-operational errors', () => {
      const error = new Error('Non-operational');
      expect(ErrorHandler.isOperational(error)).toBe(false);
    });
  });

  describe('log', () => {
    test('logs errors without throwing', () => {
      const error = new AppError('NETWORK_ERROR');
      expect(() => ErrorHandler.log(error)).not.toThrow();
    });
  });
});
