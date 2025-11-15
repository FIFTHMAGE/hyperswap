/**
 * Object utilities tests
 */

import { deepClone, deepMerge, pick, omit, get, set, isEmpty } from '@/utils/object';

describe('Object Utilities', () => {
  test('deep clones objects', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });

  test('deep merges objects', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };

    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
  });

  test('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ['a', 'c']);

    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ['b']);

    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('gets nested values', () => {
    const obj = { a: { b: { c: 'value' } } };

    expect(get(obj, 'a.b.c')).toBe('value');
    expect(get(obj, 'a.b.d', 'default')).toBe('default');
  });

  test('sets nested values', () => {
    const obj = { a: { b: {} } };
    set(obj, 'a.b.c', 'value');

    expect(obj.a.b).toEqual({ c: 'value' });
  });

  test('checks if object is empty', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});
