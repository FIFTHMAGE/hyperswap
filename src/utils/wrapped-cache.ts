/**
 * Wrapped data caching utilities
 */

const CACHE_KEY_PREFIX = 'wrapped_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export class WrappedCache {
  static set(key: string, data: any): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_KEY_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (err) {
      console.error('Cache set failed:', err);
    }
  }

  static get(key: string): any | null {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > CACHE_EXPIRY) {
        this.remove(key);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Cache get failed:', err);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${key}`);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

