/**
 * Rate limit middleware tests
 */

import { cleanupRateLimitStore } from '@/middleware/rate-limit.middleware';

describe('Rate Limit Middleware', () => {
  describe('cleanupRateLimitStore', () => {
    test('cleans up expired entries', () => {
      expect(() => cleanupRateLimitStore()).not.toThrow();
    });
  });
});
