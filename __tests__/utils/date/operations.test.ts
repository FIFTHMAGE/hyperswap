/**
 * Date operation utilities tests
 */

import {
  addDays,
  subDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  isToday,
  isPast,
  isFuture,
  diffInDays,
} from '@/utils/date/operations';

describe('Date Operation Utilities', () => {
  const testDate = new Date('2024-01-15T10:30:00Z');

  describe('addDays', () => {
    test('adds days to date', () => {
      const result = addDays(testDate, 5);
      expect(result.getDate()).toBe(20);
    });
  });

  describe('subDays', () => {
    test('subtracts days from date', () => {
      const result = subDays(testDate, 5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('addMonths', () => {
    test('adds months to date', () => {
      const result = addMonths(testDate, 2);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
    });
  });

  describe('addYears', () => {
    test('adds years to date', () => {
      const result = addYears(testDate, 1);
      expect(result.getFullYear()).toBe(2025);
    });
  });

  describe('startOfDay', () => {
    test('sets time to start of day', () => {
      const result = startOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    test('sets time to end of day', () => {
      const result = endOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });
  });

  describe('isToday', () => {
    test('returns true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    test('returns false for different date', () => {
      expect(isToday(testDate)).toBe(false);
    });
  });

  describe('isPast', () => {
    test('returns true for past date', () => {
      expect(isPast(testDate)).toBe(true);
    });

    test('returns false for future date', () => {
      const future = new Date(Date.now() + 86400000);
      expect(isPast(future)).toBe(false);
    });
  });

  describe('isFuture', () => {
    test('returns true for future date', () => {
      const future = new Date(Date.now() + 86400000);
      expect(isFuture(future)).toBe(true);
    });

    test('returns false for past date', () => {
      expect(isFuture(testDate)).toBe(false);
    });
  });

  describe('diffInDays', () => {
    test('calculates difference in days', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-11');
      const result = diffInDays(date1, date2);
      expect(result).toBe(10);
    });
  });
});
