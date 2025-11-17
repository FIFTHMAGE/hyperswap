/**
 * Cache strategy service with multiple caching strategies
 * @module services/cache
 */

import type { CacheStrategy } from '@/config/cache.config';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class CacheStrategyService {
  private caches = new Map<string, Map<string, CacheEntry<unknown>>>();

  /**
   * Get value from cache
   */
  get<T>(namespace: string, key: string, _strategy: CacheStrategy = 'cache-first'): T | null {
    const cache = this.caches.get(namespace);
    if (!cache) return null;

    const entry = cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return null;
    }

    // Update hits for LRU/LFU
    entry.hits++;

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set<T>(namespace: string, key: string, value: T, ttl: number = 60000): void {
    let cache = this.caches.get(namespace);
    if (!cache) {
      cache = new Map();
      this.caches.set(namespace, cache);
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    };

    cache.set(key, entry as CacheEntry<unknown>);
  }

  /**
   * Invalidate cache entry
   */
  invalidate(namespace: string, key?: string): void {
    if (key) {
      this.caches.get(namespace)?.delete(key);
    } else {
      this.caches.delete(namespace);
    }
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.caches.clear();
  }
}

export const cacheStrategy = new CacheStrategyService();
