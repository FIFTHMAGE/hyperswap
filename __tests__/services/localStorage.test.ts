/**
 * LocalStorage service tests
 */

import { localStorageService } from '@/services/storage/local-storage.service';

describe('LocalStorage Service', () => {
  beforeEach(() => {
    localStorageService.clear();
  });

  test('sets and gets items', () => {
    localStorageService.setItem('test', { value: 'data' });
    const result = localStorageService.getItem<{ value: string }>('test');

    expect(result).toEqual({ value: 'data' });
  });

  test('returns null for missing items', () => {
    const result = localStorageService.getItem('nonexistent');
    expect(result).toBeNull();
  });

  test('removes items', () => {
    localStorageService.setItem('test', 'value');
    localStorageService.removeItem('test');

    expect(localStorageService.getItem('test')).toBeNull();
  });

  test('checks if key exists', () => {
    localStorageService.setItem('test', 'value');

    expect(localStorageService.has('test')).toBe(true);
    expect(localStorageService.has('missing')).toBe(false);
  });

  test('gets all keys', () => {
    localStorageService.setItem('key1', 'value1');
    localStorageService.setItem('key2', 'value2');

    const keys = localStorageService.keys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
  });
});
