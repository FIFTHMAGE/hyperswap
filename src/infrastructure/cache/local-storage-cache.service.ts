/**
 * LocalStorage cache service with automatic serialization
 * @module services/cache/local-storage-cache
 */

import { setItemWithExpiry, getItemWithExpiry, hasItem, removeItem } from '@/utils/browser/storage';

export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = 'cache_') {
    this.prefix = prefix;
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttlMs: number): boolean {
    return setItemWithExpiry(this.getKey(key), value, ttlMs);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    return getItemWithExpiry<T>(this.getKey(key));
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return hasItem(this.getKey(key));
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    return removeItem(this.getKey(key));
  }

  /**
   * Get or set with fetcher
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs: number): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    this.set(key, value, ttlMs);

    return value;
  }
}

// Global instance
export const localStorageCache = new LocalStorageCache();
