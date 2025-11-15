/**
 * Date formatting utilities tests
 */

import {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatISO,
  formatDateYMD,
} from '@/utils/date/format';

describe('Date Format Utilities', () => {
  const testDate = new Date('2024-01-15T10:30:00Z');

  describe('formatDate', () => {
    test('formats date', () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/1\/15\/2024/);
    });
  });

  describe('formatTime', () => {
    test('formats time', () => {
      const result = formatTime(testDate);
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateTime', () => {
    test('formats date and time', () => {
      const result = formatDateTime(testDate);
      expect(typeof result).toBe('string');
    });
  });

  describe('formatRelativeTime', () => {
    test('formats "just now"', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    test('formats seconds ago', () => {
      const date = new Date(Date.now() - 30000);
      const result = formatRelativeTime(date);
      expect(result).toMatch(/second/);
    });

    test('formats minutes ago', () => {
      const date = new Date(Date.now() - 120000);
      const result = formatRelativeTime(date);
      expect(result).toMatch(/minute/);
    });
  });

  describe('formatISO', () => {
    test('formats ISO date', () => {
      const result = formatISO(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('formatDateYMD', () => {
    test('formats date as YYYY-MM-DD', () => {
      const result = formatDateYMD(testDate);
      expect(result).toBe('2024-01-15');
    });
  });
});
