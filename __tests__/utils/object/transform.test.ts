/**
 * Object transformation utilities tests
 */

import {
  mapValues,
  filterObject,
  invertObject,
  flattenObject,
  unflattenObject,
} from '@/utils/object/transform';

describe('Object Transformation Utilities', () => {
  describe('mapValues', () => {
    test('maps object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, (v) => v * 2);

      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });
  });

  describe('filterObject', () => {
    test('filters object by predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterObject(obj, (v) => (v as number) > 1);

      expect(result).toEqual({ b: 2, c: 3 });
    });
  });

  describe('invertObject', () => {
    test('inverts keys and values', () => {
      const obj = { a: '1', b: '2' };
      const result = invertObject(obj);

      expect(result).toEqual({ '1': 'a', '2': 'b' });
    });
  });

  describe('flattenObject', () => {
    test('flattens nested object', () => {
      const obj = { a: { b: { c: 1 } } };
      const result = flattenObject(obj);

      expect(result).toEqual({ 'a.b.c': 1 });
    });

    test('handles mixed nesting', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      const result = flattenObject(obj);

      expect(result).toEqual({ a: 1, 'b.c': 2, 'b.d.e': 3 });
    });
  });

  describe('unflattenObject', () => {
    test('unflattens dot notation keys', () => {
      const obj = { 'a.b.c': 1 };
      const result = unflattenObject(obj);

      expect(result).toEqual({ a: { b: { c: 1 } } });
    });

    test('handles mixed keys', () => {
      const obj = { a: 1, 'b.c': 2, 'b.d.e': 3 };
      const result = unflattenObject(obj);

      expect(result).toEqual({ a: 1, b: { c: 2, d: { e: 3 } } });
    });
  });
});
