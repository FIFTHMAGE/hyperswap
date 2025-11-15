/**
 * Validators tests
 */

import {
  validateEmail,
  validateUrl,
  validateEthAddress,
  validatePositiveNumber,
  validateStringLength,
  validateRequired,
  validateArray,
  validateObject,
} from '@/lib/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    test('validates correct URL', () => {
      expect(validateUrl('https://example.com')).toBe(true);
    });

    test('rejects invalid URL', () => {
      expect(validateUrl('not-a-url')).toBe(false);
    });
  });

  describe('validateEthAddress', () => {
    test('validates correct address', () => {
      expect(validateEthAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(true);
    });

    test('rejects invalid address', () => {
      expect(validateEthAddress('0xinvalid')).toBe(false);
      expect(validateEthAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
    });
  });

  describe('validatePositiveNumber', () => {
    test('validates positive number', () => {
      expect(validatePositiveNumber(1)).toBe(true);
      expect(validatePositiveNumber(100.5)).toBe(true);
    });

    test('rejects zero and negative', () => {
      expect(validatePositiveNumber(0)).toBe(false);
      expect(validatePositiveNumber(-1)).toBe(false);
    });
  });

  describe('validateStringLength', () => {
    test('validates string within range', () => {
      expect(validateStringLength('test', 1, 10)).toBe(true);
    });

    test('rejects string outside range', () => {
      expect(validateStringLength('test', 5, 10)).toBe(false);
      expect(validateStringLength('test', 1, 3)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    test('validates non-empty values', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
    });

    test('rejects empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateArray', () => {
    test('validates arrays', () => {
      expect(validateArray([])).toBe(true);
      expect(validateArray([1, 2, 3])).toBe(true);
    });

    test('rejects non-arrays', () => {
      expect(validateArray({})).toBe(false);
      expect(validateArray('test')).toBe(false);
    });
  });

  describe('validateObject', () => {
    test('validates objects', () => {
      expect(validateObject({})).toBe(true);
      expect(validateObject({ key: 'value' })).toBe(true);
    });

    test('rejects non-objects', () => {
      expect(validateObject([])).toBe(false);
      expect(validateObject(null)).toBe(false);
      expect(validateObject('test')).toBe(false);
    });
  });
});
