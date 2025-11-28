/**
 * Cache Service tests
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CacheService } from '../core/cache/cache.service';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cache.clear();
    vi.useRealTimers();
  });

  describe('set and get', () => {
    it('should set and get values', () => {
      cache.set('key1', 'value1');

      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for missing keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should overwrite existing values', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2');

      expect(cache.get('key1')).toBe('value2');
    });

    it('should store complex objects', () => {
      const obj = {
        nested: { value: 123 },
        array: [1, 2, 3],
        date: new Date().toISOString(),
      };

      cache.set('complex', obj);

      expect(cache.get('complex')).toEqual(obj);
    });

    it('should store arrays', () => {
      const arr = [1, 2, 3, { nested: true }];

      cache.set('array', arr);

      expect(cache.get('array')).toEqual(arr);
    });

    it('should handle null values', () => {
      cache.set('null', null);

      expect(cache.get('null')).toBeNull();
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cache.set('key1', 'value1');

      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for missing keys', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete values', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.has('key1')).toBe(false);
    });

    it('should return true when key existed', () => {
      cache.set('key1', 'value1');

      expect(cache.delete('key1')).toBe(true);
    });

    it('should return false when key did not exist', () => {
      expect(cache.delete('nonexistent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all values', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.clear();

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBeUndefined();
      expect(cache.size).toBe(0);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire values after TTL', () => {
      cache.set('key1', 'value1', 1000); // 1 second TTL

      expect(cache.get('key1')).toBe('value1');

      vi.advanceTimersByTime(1001);

      expect(cache.get('key1')).toBeUndefined();
    });

    it('should not expire values without TTL', () => {
      cache.set('key1', 'value1'); // No TTL

      vi.advanceTimersByTime(100000);

      expect(cache.get('key1')).toBe('value1');
    });

    it('should reset TTL when value is updated', () => {
      cache.set('key1', 'value1', 1000);

      vi.advanceTimersByTime(500);

      cache.set('key1', 'value2', 1000);

      vi.advanceTimersByTime(600);

      expect(cache.get('key1')).toBe('value2');

      vi.advanceTimersByTime(500);

      expect(cache.get('key1')).toBeUndefined();
    });

    it('should handle multiple items with different TTLs', () => {
      cache.set('short', 'value1', 500);
      cache.set('medium', 'value2', 1000);
      cache.set('long', 'value3', 2000);

      vi.advanceTimersByTime(600);

      expect(cache.get('short')).toBeUndefined();
      expect(cache.get('medium')).toBe('value2');
      expect(cache.get('long')).toBe('value3');

      vi.advanceTimersByTime(500);

      expect(cache.get('medium')).toBeUndefined();
      expect(cache.get('long')).toBe('value3');
    });
  });

  describe('size', () => {
    it('should return correct size', () => {
      expect(cache.size).toBe(0);

      cache.set('key1', 'value1');
      expect(cache.size).toBe(1);

      cache.set('key2', 'value2');
      expect(cache.size).toBe(2);

      cache.delete('key1');
      expect(cache.size).toBe(1);
    });
  });

  describe('keys', () => {
    it('should return all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      const keys = cache.keys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('should return empty array when cache is empty', () => {
      expect(cache.keys()).toEqual([]);
    });
  });

  describe('values', () => {
    it('should return all values', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const values = cache.values();

      expect(values).toHaveLength(2);
      expect(values).toContain('value1');
      expect(values).toContain('value2');
    });
  });

  describe('entries', () => {
    it('should return all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const entries = cache.entries();

      expect(entries).toHaveLength(2);
      expect(entries).toContainEqual(['key1', 'value1']);
      expect(entries).toContainEqual(['key2', 'value2']);
    });
  });

  describe('getOrSet', () => {
    it('should get existing value', async () => {
      cache.set('key1', 'existing');

      const result = await cache.getOrSet('key1', async () => 'computed');

      expect(result).toBe('existing');
    });

    it('should compute and set value when missing', async () => {
      const result = await cache.getOrSet('key1', async () => 'computed');

      expect(result).toBe('computed');
      expect(cache.get('key1')).toBe('computed');
    });

    it('should set with TTL', async () => {
      await cache.getOrSet('key1', async () => 'computed', 1000);

      expect(cache.get('key1')).toBe('computed');

      vi.advanceTimersByTime(1001);

      expect(cache.get('key1')).toBeUndefined();
    });

    it('should handle async factory errors', async () => {
      await expect(
        cache.getOrSet('key1', async () => {
          throw new Error('Factory error');
        })
      ).rejects.toThrow('Factory error');

      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('memoize', () => {
    it('should memoize function results', async () => {
      const fn = vi.fn((a: number, b: number) => a + b);
      const memoized = cache.memoize(fn);

      const result1 = await memoized(1, 2);
      const result2 = await memoized(1, 2);

      expect(result1).toBe(3);
      expect(result2).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should cache with different arguments separately', async () => {
      const fn = vi.fn((a: number) => a * 2);
      const memoized = cache.memoize(fn);

      const result1 = await memoized(5);
      const result2 = await memoized(10);

      expect(result1).toBe(10);
      expect(result2).toBe(20);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('stats', () => {
    it('should track hits and misses', () => {
      cache.set('key1', 'value1');

      cache.get('key1'); // Hit
      cache.get('key1'); // Hit
      cache.get('nonexistent'); // Miss

      const stats = cache.getStats();

      expect(stats.hits).toBeGreaterThanOrEqual(2);
      expect(stats.misses).toBeGreaterThanOrEqual(1);
    });

    it('should calculate hit rate', () => {
      cache.set('key1', 'value1');

      cache.get('key1'); // Hit
      cache.get('key1'); // Hit
      cache.get('key1'); // Hit
      cache.get('miss'); // Miss

      const stats = cache.getStats();

      expect(stats.hitRate).toBeCloseTo(0.75, 1);
    });
  });
});

