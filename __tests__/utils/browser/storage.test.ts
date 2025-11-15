/**
 * Browser storage utilities tests
 */

import { storage } from '@/utils/browser/storage';

describe('Browser Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('localStorage', () => {
    test('sets and gets value', () => {
      storage.local.set('test', { foo: 'bar' });
      expect(storage.local.get('test')).toEqual({ foo: 'bar' });
    });

    test('returns null for missing key', () => {
      expect(storage.local.get('missing')).toBeNull();
    });

    test('removes value', () => {
      storage.local.set('test', 'value');
      storage.local.remove('test');
      expect(storage.local.get('test')).toBeNull();
    });

    test('clears all values', () => {
      storage.local.set('key1', 'value1');
      storage.local.set('key2', 'value2');
      storage.local.clear();

      expect(storage.local.get('key1')).toBeNull();
      expect(storage.local.get('key2')).toBeNull();
    });
  });

  describe('sessionStorage', () => {
    test('sets and gets value', () => {
      storage.session.set('test', { foo: 'bar' });
      expect(storage.session.get('test')).toEqual({ foo: 'bar' });
    });

    test('returns null for missing key', () => {
      expect(storage.session.get('missing')).toBeNull();
    });
  });
});
