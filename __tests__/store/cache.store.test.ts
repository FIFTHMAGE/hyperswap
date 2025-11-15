/**
 * Cache store tests
 */

import { useCacheStore } from '@/store/cache.store';

describe('Cache Store', () => {
  beforeEach(() => {
    useCacheStore.getState().clear();
  });

  test('sets and gets value', () => {
    useCacheStore.getState().set('test-key', 'test-value');
    expect(useCacheStore.getState().get('test-key')).toBe('test-value');
  });

  test('returns null for missing key', () => {
    expect(useCacheStore.getState().get('missing')).toBeNull();
  });

  test('checks if key exists', () => {
    useCacheStore.getState().set('test-key', 'value');
    expect(useCacheStore.getState().has('test-key')).toBe(true);
    expect(useCacheStore.getState().has('missing')).toBe(false);
  });

  test('deletes value', () => {
    useCacheStore.getState().set('test-key', 'value');
    useCacheStore.getState().delete('test-key');
    expect(useCacheStore.getState().has('test-key')).toBe(false);
  });

  test('clears all values', () => {
    useCacheStore.getState().set('key1', 'value1');
    useCacheStore.getState().set('key2', 'value2');
    useCacheStore.getState().clear();

    expect(useCacheStore.getState().has('key1')).toBe(false);
    expect(useCacheStore.getState().has('key2')).toBe(false);
  });

  test('expires old entries', () => {
    useCacheStore.getState().set('key', 'value', 100); // 100ms TTL
    expect(useCacheStore.getState().has('key')).toBe(true);

    setTimeout(() => {
      expect(useCacheStore.getState().get('key')).toBeNull();
    }, 150);
  });

  test('prunes expired entries', () => {
    useCacheStore.getState().set('key1', 'value1', 100);
    useCacheStore.getState().set('key2', 'value2', 10000);

    setTimeout(() => {
      useCacheStore.getState().prune();
      expect(useCacheStore.getState().has('key1')).toBe(false);
      expect(useCacheStore.getState().has('key2')).toBe(true);
    }, 150);
  });
});
