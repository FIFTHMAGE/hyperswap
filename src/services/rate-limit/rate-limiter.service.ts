/**
 * Rate limiter service with token bucket algorithm
 * @module services/rate-limit
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per second
}

class RateLimiterService {
  private buckets = new Map<string, TokenBucket>();

  /**
   * Check if request is allowed
   */
  async tryAcquire(key: string, tokensNeeded: number = 1): Promise<boolean> {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: 10,
        lastRefill: Date.now(),
        capacity: 10,
        refillRate: 1, // 1 token per second
      };
      this.buckets.set(key, bucket);
    }

    // Refill tokens
    this.refillBucket(bucket);

    // Check if enough tokens
    if (bucket.tokens >= tokensNeeded) {
      bucket.tokens -= tokensNeeded;
      return true;
    }

    return false;
  }

  /**
   * Refill bucket based on time elapsed
   */
  private refillBucket(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = (now - bucket.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * bucket.refillRate;

    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  /**
   * Configure rate limit for key
   */
  configure(key: string, capacity: number, refillRate: number): void {
    const bucket = this.buckets.get(key);
    if (bucket) {
      bucket.capacity = capacity;
      bucket.refillRate = refillRate;
    } else {
      this.buckets.set(key, {
        tokens: capacity,
        lastRefill: Date.now(),
        capacity,
        refillRate,
      });
    }
  }

  /**
   * Reset rate limit for key
   */
  reset(key: string): void {
    this.buckets.delete(key);
  }
}

export const rateLimiter = new RateLimiterService();
