/**
 * Cache service tests
 */

import { cacheStrategy } from '@/services/cache/cache-strategy.service';

describe('Cache Strategy Service', () => {
  beforeEach(() => {
    cacheStrategy.clearAll();
  });

  test('sets and gets cache values', () => {
    cacheStrategy.set('test', 'key1', 'value1');
    expect(cacheStrategy.get('test', 'key1')).toBe('value1');
  });

  test('returns null for missing keys', () => {
    expect(cacheStrategy.get('test', 'nonexistent')).toBeNull();
  });

  test('expires entries after TTL', () => {
    cacheStrategy.set('test', 'key1', 'value1', 100); // 100ms TTL

    expect(cacheStrategy.get('test', 'key1')).toBe('value1');

    // Wait for expiry
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(cacheStrategy.get('test', 'key1')).toBeNull();
        resolve(true);
      }, 150);
    });
  });

  test('invalidates specific keys', () => {
    cacheStrategy.set('test', 'key1', 'value1');
    cacheStrategy.set('test', 'key2', 'value2');

    cacheStrategy.invalidate('test', 'key1');

    expect(cacheStrategy.get('test', 'key1')).toBeNull();
    expect(cacheStrategy.get('test', 'key2')).toBe('value2');
  });

  test('clears all caches', () => {
    cacheStrategy.set('test1', 'key1', 'value1');
    cacheStrategy.set('test2', 'key2', 'value2');

    cacheStrategy.clearAll();

    expect(cacheStrategy.get('test1', 'key1')).toBeNull();
    expect(cacheStrategy.get('test2', 'key2')).toBeNull();
  });
});
