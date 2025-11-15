/**
 * Object merge utilities tests
 */

import { deepMerge, merge, mergeConcat } from '@/utils/object/merge';

describe('Object Merge Utilities', () => {
  describe('deepMerge', () => {
    test('merges simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('merges nested objects', () => {
      const target = { a: { x: 1, y: 2 } };
      const source = { a: { y: 3, z: 4 } };

      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });

    test('does not mutate original objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      deepMerge(target, source);

      expect(target).toEqual({ a: 1 });
      expect(source).toEqual({ b: 2 });
    });
  });

  describe('merge', () => {
    test('merges multiple objects', () => {
      const result = merge({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test('later values override earlier ones', () => {
      const result = merge({ a: 1 }, { a: 2 }, { a: 3 });
      expect(result).toEqual({ a: 3 });
    });
  });

  describe('mergeConcat', () => {
    test('concatenates arrays', () => {
      const target = { arr: [1, 2] };
      const source = { arr: [3, 4] };

      const result = mergeConcat(target, source);

      expect(result).toEqual({ arr: [1, 2, 3, 4] });
    });

    test('deep merges objects with array concat', () => {
      const target = { nested: { arr: [1] } };
      const source = { nested: { arr: [2] } };

      const result = mergeConcat(target, source);

      expect(result).toEqual({ nested: { arr: [1, 2] } });
    });
  });
});
