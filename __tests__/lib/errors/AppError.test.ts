/**
 * AppError tests
 */

import { AppError, ValidationError, NetworkError } from '@/lib/errors';

describe('AppError', () => {
  test('creates error with code and message', () => {
    const error = new AppError('NETWORK_ERROR', 'Custom message', 503);
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toBe('Custom message');
    expect(error.statusCode).toBe(503);
  });

  test('uses default message from ERROR_MESSAGES', () => {
    const error = new AppError('NETWORK_ERROR');
    expect(error.message).toBe('Network error occurred');
  });

  test('toJSON returns serializable object', () => {
    const error = new AppError('INVALID_INPUT', 'Test', 400, true, { field: 'email' });
    const json = error.toJSON();

    expect(json).toEqual({
      code: 'INVALID_INPUT',
      message: 'Test',
      statusCode: 400,
      context: { field: 'email' },
    });
  });
});

describe('ValidationError', () => {
  test('creates validation error', () => {
    const error = new ValidationError('Invalid email');
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid email');
  });
});

describe('NetworkError', () => {
  test('creates network error', () => {
    const error = new NetworkError('Connection timeout');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.statusCode).toBe(503);
  });
});
