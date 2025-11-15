/**
 * Array filter utilities tests
 */

import { multiFilter, fuzzyFilter, uniqueBy, partition } from '@/utils/array/filter';

describe('Array Filter Utilities', () => {
  describe('multiFilter', () => {
    const data = [
      { name: 'Alice', age: 25, city: 'NYC' },
      { name: 'Bob', age: 30, city: 'LA' },
      { name: 'Charlie', age: 25, city: 'NYC' },
    ];

    test('filters by single criteria', () => {
      const result = multiFilter(data, { age: 25 });
      expect(result).toHaveLength(2);
    });

    test('filters by multiple criteria', () => {
      const result = multiFilter(data, { age: 25, city: 'NYC' });
      expect(result).toHaveLength(2);
    });
  });

  describe('fuzzyFilter', () => {
    const data = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' }];

    test('performs case-insensitive search', () => {
      const result = fuzzyFilter(data, 'app', ['name']);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Apple');
    });

    test('searches across multiple keys', () => {
      const items = [
        { name: 'Apple', category: 'Fruit' },
        { name: 'Carrot', category: 'Vegetable' },
      ];

      const result = fuzzyFilter(items, 'fruit', ['name', 'category']);
      expect(result).toHaveLength(1);
    });
  });

  describe('uniqueBy', () => {
    test('removes duplicates by key', () => {
      const data = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 1, name: 'C' },
      ];

      const result = uniqueBy(data, 'id');
      expect(result).toHaveLength(2);
    });
  });

  describe('partition', () => {
    test('splits array by predicate', () => {
      const data = [1, 2, 3, 4, 5, 6];
      const [even, odd] = partition(data, (n) => n % 2 === 0);

      expect(even).toEqual([2, 4, 6]);
      expect(odd).toEqual([1, 3, 5]);
    });
  });
});
