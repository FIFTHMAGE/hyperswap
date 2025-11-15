/**
 * Error constants tests
 */

import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants/errors';

describe('Error Constants', () => {
  test('ERROR_CODES contains all error types', () => {
    expect(ERROR_CODES.NETWORK_ERROR).toBe('NETWORK_ERROR');
    expect(ERROR_CODES.INVALID_INPUT).toBe('INVALID_INPUT');
    expect(ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
  });

  test('ERROR_MESSAGES maps to all ERROR_CODES', () => {
    Object.values(ERROR_CODES).forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_MESSAGES[code]).toBe('string');
    });
  });
});
