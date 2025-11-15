/**
 * Pagination utilities tests
 */

import { paginate, getPageRange } from '@/utils/array/paginate';

describe('Pagination Utilities', () => {
  describe('paginate', () => {
    const data = Array.from({ length: 100 }, (_, i) => i + 1);

    test('returns correct page data', () => {
      const result = paginate(data, 1, 10);

      expect(result.data).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(10);
      expect(result.totalItems).toBe(100);
    });

    test('handles last page correctly', () => {
      const result = paginate(data, 10, 10);

      expect(result.data).toEqual([91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(true);
    });

    test('handles out of bounds page', () => {
      const result = paginate(data, 999, 10);

      expect(result.page).toBe(10);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('getPageRange', () => {
    test('returns correct range for middle pages', () => {
      const range = getPageRange(5, 10, 5);
      expect(range).toEqual([3, 4, 5, 6, 7]);
    });

    test('returns correct range for first pages', () => {
      const range = getPageRange(1, 10, 5);
      expect(range).toEqual([1, 2, 3, 4, 5]);
    });

    test('returns correct range for last pages', () => {
      const range = getPageRange(10, 10, 5);
      expect(range).toEqual([6, 7, 8, 9, 10]);
    });
  });
});
