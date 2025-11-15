/**
 * Rate limiter service tests
 */

import { rateLimiter } from '@/services/rate-limit/rate-limiter.service';

describe('Rate Limiter Service', () => {
  beforeEach(() => {
    rateLimiter.reset('test-key');
  });

  test('allows requests within limit', async () => {
    const result1 = await rateLimiter.tryAcquire('test-key');
    const result2 = await rateLimiter.tryAcquire('test-key');

    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test('blocks requests exceeding limit', async () => {
    rateLimiter.configure('test-key', 2, 1);

    const result1 = await rateLimiter.tryAcquire('test-key');
    const result2 = await rateLimiter.tryAcquire('test-key');
    const result3 = await rateLimiter.tryAcquire('test-key');

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(false);
  });

  test('refills tokens over time', async () => {
    rateLimiter.configure('test-key', 1, 10); // 10 tokens per second

    await rateLimiter.tryAcquire('test-key');

    // Wait for refill
    await new Promise((resolve) => setTimeout(resolve, 200));

    const result = await rateLimiter.tryAcquire('test-key');
    expect(result).toBe(true);
  });
});
