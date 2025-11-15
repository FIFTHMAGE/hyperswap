/**
 * Array utilities tests
 */

import { unique, chunk, groupBy, sortBy } from '@/utils/array';

describe('Array Utilities', () => {
  test('removes duplicates', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });

  test('chunks array', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  test('groups by key', () => {
    const data = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ];

    const grouped = groupBy(data, 'type');
    expect(grouped.a).toHaveLength(2);
    expect(grouped.b).toHaveLength(1);
  });

  test('sorts by key', () => {
    const data = [
      { name: 'c', value: 3 },
      { name: 'a', value: 1 },
      { name: 'b', value: 2 },
    ];

    const sorted = sortBy(data, 'name');
    expect(sorted[0].name).toBe('a');
    expect(sorted[2].name).toBe('c');
  });
});
