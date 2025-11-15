interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }) {
    this.config = config;
  }

  check(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }
}

export const apiRateLimiter = new RateLimiter({ maxRequests: 30, windowMs: 60000 });
export const walletRateLimiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });

