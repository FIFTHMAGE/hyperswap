/**
 * Formatters tests
 */

import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatBytes,
  formatPhoneNumber,
} from '@/lib/formatters';

describe('Formatters', () => {
  describe('formatNumber', () => {
    test('formats number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000.00');
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });
  });

  describe('formatCurrency', () => {
    test('formats USD currency', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatPercentage', () => {
    test('formats percentage', () => {
      expect(formatPercentage(12.34)).toBe('12.34%');
      expect(formatPercentage(100)).toBe('100.00%');
    });
  });

  describe('formatCompactNumber', () => {
    test('formats with K suffix', () => {
      expect(formatCompactNumber(1500)).toBe('1.50K');
    });

    test('formats with M suffix', () => {
      expect(formatCompactNumber(1500000)).toBe('1.50M');
    });

    test('formats with B suffix', () => {
      expect(formatCompactNumber(1500000000)).toBe('1.50B');
    });

    test('formats small numbers without suffix', () => {
      expect(formatCompactNumber(500)).toBe('500');
    });
  });

  describe('formatBytes', () => {
    test('formats bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('formatPhoneNumber', () => {
    test('formats 10-digit phone number', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    test('returns original if invalid format', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });
});
