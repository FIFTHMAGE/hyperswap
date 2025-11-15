/**
 * Auth middleware tests
 */

import { verifyAuthToken } from '@/middleware/auth.middleware';

describe('Auth Middleware', () => {
  describe('verifyAuthToken', () => {
    test('returns false for null token', () => {
      expect(verifyAuthToken(null)).toBe(false);
    });

    test('returns false for empty token', () => {
      expect(verifyAuthToken('')).toBe(false);
    });

    test('returns true for valid token', () => {
      expect(verifyAuthToken('valid-token')).toBe(true);
    });
  });
});
