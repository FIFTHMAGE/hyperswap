/**
 * Rate Limiter Service tests
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RateLimiter } from '../core/rate-limiter/rate-limiter.service';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    rateLimiter = new RateLimiter({
      maxRequests: 5,
      windowMs: 1000, // 1 second window
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should allow requests under limit', async () => {
      const allowed = await rateLimiter.checkLimit('user1');

      expect(allowed).toBe(true);
    });

    it('should track request count', async () => {
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user1');

      const remaining = rateLimiter.getRemainingRequests('user1');

      expect(remaining).toBe(2);
    });

    it('should block requests over limit', async () => {
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit('user1');
      }

      // 6th request should be blocked
      const allowed = await rateLimiter.checkLimit('user1');

      expect(allowed).toBe(false);
    });
  });

  describe('window reset', () => {
    it('should reset after window expires', async () => {
      // Use all requests
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit('user1');
      }

      expect(await rateLimiter.checkLimit('user1')).toBe(false);

      // Advance time past window
      vi.advanceTimersByTime(1001);

      // Should allow requests again
      expect(await rateLimiter.checkLimit('user1')).toBe(true);
    });
  });

  describe('per-key limits', () => {
    it('should track limits separately per key', async () => {
      // Use all requests for user1
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit('user1');
      }

      // user2 should still have quota
      const allowed = await rateLimiter.checkLimit('user2');

      expect(allowed).toBe(true);
      expect(rateLimiter.getRemainingRequests('user2')).toBe(4);
    });
  });

  describe('getRemainingRequests', () => {
    it('should return max requests for new key', () => {
      const remaining = rateLimiter.getRemainingRequests('newUser');

      expect(remaining).toBe(5);
    });

    it('should return correct remaining after requests', async () => {
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user1');

      expect(rateLimiter.getRemainingRequests('user1')).toBe(3);
    });

    it('should return 0 when limit reached', async () => {
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit('user1');
      }

      expect(rateLimiter.getRemainingRequests('user1')).toBe(0);
    });
  });

  describe('getResetTime', () => {
    it('should return time until reset', async () => {
      await rateLimiter.checkLimit('user1');

      const resetTime = rateLimiter.getResetTime('user1');

      expect(resetTime).toBeGreaterThan(0);
      expect(resetTime).toBeLessThanOrEqual(1000);
    });

    it('should update after time passes', async () => {
      await rateLimiter.checkLimit('user1');

      const initialReset = rateLimiter.getResetTime('user1');

      vi.advanceTimersByTime(500);

      const laterReset = rateLimiter.getResetTime('user1');

      expect(laterReset).toBeLessThan(initialReset);
    });
  });

  describe('reset', () => {
    it('should reset specific key', async () => {
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit('user1');
      }

      expect(await rateLimiter.checkLimit('user1')).toBe(false);

      rateLimiter.reset('user1');

      expect(await rateLimiter.checkLimit('user1')).toBe(true);
      expect(rateLimiter.getRemainingRequests('user1')).toBe(4);
    });

    it('should not affect other keys', async () => {
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user2');

      rateLimiter.reset('user1');

      expect(rateLimiter.getRemainingRequests('user1')).toBe(5);
      expect(rateLimiter.getRemainingRequests('user2')).toBe(4);
    });
  });

  describe('resetAll', () => {
    it('should reset all keys', async () => {
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user2');
      await rateLimiter.checkLimit('user3');

      rateLimiter.resetAll();

      expect(rateLimiter.getRemainingRequests('user1')).toBe(5);
      expect(rateLimiter.getRemainingRequests('user2')).toBe(5);
      expect(rateLimiter.getRemainingRequests('user3')).toBe(5);
    });
  });

  describe('different configurations', () => {
    it('should work with custom limits', async () => {
      const customLimiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 5000,
      });

      expect(await customLimiter.checkLimit('user1')).toBe(true);
      expect(await customLimiter.checkLimit('user1')).toBe(true);
      expect(await customLimiter.checkLimit('user1')).toBe(false);
    });

    it('should support very short windows', async () => {
      const shortWindowLimiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 100,
      });

      expect(await shortWindowLimiter.checkLimit('user1')).toBe(true);
      expect(await shortWindowLimiter.checkLimit('user1')).toBe(false);

      vi.advanceTimersByTime(101);

      expect(await shortWindowLimiter.checkLimit('user1')).toBe(true);
    });
  });

  describe('sliding window', () => {
    it('should use sliding window for requests', async () => {
      const slidingLimiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 1000,
        slidingWindow: true,
      });

      // Make 3 requests at t=0
      await slidingLimiter.checkLimit('user1');
      await slidingLimiter.checkLimit('user1');
      await slidingLimiter.checkLimit('user1');

      // Should be blocked
      expect(await slidingLimiter.checkLimit('user1')).toBe(false);

      // After half the window, oldest request should still count
      vi.advanceTimersByTime(500);

      expect(await slidingLimiter.checkLimit('user1')).toBe(false);

      // After full window, should allow again
      vi.advanceTimersByTime(501);

      expect(await slidingLimiter.checkLimit('user1')).toBe(true);
    });
  });

  describe('consume', () => {
    it('should consume multiple tokens at once', async () => {
      expect(await rateLimiter.consume('user1', 3)).toBe(true);
      expect(rateLimiter.getRemainingRequests('user1')).toBe(2);
    });

    it('should reject if not enough tokens', async () => {
      expect(await rateLimiter.consume('user1', 10)).toBe(false);
      expect(rateLimiter.getRemainingRequests('user1')).toBe(5);
    });
  });

  describe('waitForToken', () => {
    it('should wait until token available', async () => {
      // Use all tokens
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit('user1');
      }

      const waitPromise = rateLimiter.waitForToken('user1');

      // Advance time to trigger token availability
      vi.advanceTimersByTime(1001);

      const result = await waitPromise;
      expect(result).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return rate limiter statistics', async () => {
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user1');
      await rateLimiter.checkLimit('user2');

      const stats = rateLimiter.getStats();

      expect(stats.totalRequests).toBeGreaterThanOrEqual(3);
      expect(stats.activeKeys).toBe(2);
    });
  });
});

