/**
 * Type guards tests
 */

import { describe, expect, it } from 'vitest';

import {
  isString,
  isNumber,
  isBoolean,
  isNull,
  isUndefined,
  isNullish,
  isObject,
  isArray,
  isFunction,
  isPromise,
  isDate,
  isError,
  isAddress,
  isHash,
  isChainId,
  isToken,
  isEmail,
  isUrl,
  isUuid,
  isPositive,
  isNonNegative,
  isInteger,
  isInRange,
  isValidAmount,
  isPositiveAmount,
  hasValidDecimals,
  isArrayOf,
  isNonEmptyArray,
  isStringArray,
  isNumberArray,
  hasProperty,
  hasProperties,
  isEmptyObject,
  isNetworkError,
  isTimeoutError,
  isUserRejection,
  isInsufficientFunds,
  assertDefined,
  assertAddress,
  assertPositive,
  nonNull,
  filterNullish,
} from '../guards';

describe('Primitive Type Guards', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-456)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for non-undefined', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('should return true for null and undefined', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction('function')).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    it('should return true for thenable objects', () => {
      expect(isPromise({ then: () => {} })).toBe(true);
    });

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(() => {})).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid dates', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2023-01-01'))).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-dates', () => {
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(Date.now())).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for errors', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
    });

    it('should return false for non-errors', () => {
      expect(isError({ message: 'error' })).toBe(false);
      expect(isError('error')).toBe(false);
    });
  });
});

describe('Blockchain Type Guards', () => {
  describe('isAddress', () => {
    it('should return true for valid addresses', () => {
      expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(isAddress('0xABCDEF1234567890123456789012345678901234')).toBe(true);
    });

    it('should return false for invalid addresses', () => {
      expect(isAddress('0x123')).toBe(false);
      expect(isAddress('1234567890123456789012345678901234567890')).toBe(false);
      expect(isAddress('0x12345678901234567890123456789012345678901')).toBe(false);
      expect(isAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false);
    });
  });

  describe('isHash', () => {
    it('should return true for valid hashes', () => {
      expect(isHash('0x1234567890123456789012345678901234567890123456789012345678901234')).toBe(true);
    });

    it('should return false for invalid hashes', () => {
      expect(isHash('0x123')).toBe(false);
      expect(isHash('0x1234567890123456789012345678901234567890')).toBe(false);
    });
  });

  describe('isChainId', () => {
    it('should return true for valid chain IDs', () => {
      expect(isChainId(1)).toBe(true);
      expect(isChainId(137)).toBe(true);
      expect(isChainId(43114)).toBe(true);
    });

    it('should return false for invalid chain IDs', () => {
      expect(isChainId(0)).toBe(false);
      expect(isChainId(-1)).toBe(false);
      expect(isChainId(1.5)).toBe(false);
      expect(isChainId('1')).toBe(false);
    });
  });

  describe('isToken', () => {
    it('should return true for valid token objects', () => {
      expect(
        isToken({
          address: '0x1234567890123456789012345678901234567890',
          chainId: 1,
          decimals: 18,
          symbol: 'ETH',
          name: 'Ethereum',
        })
      ).toBe(true);
    });

    it('should return false for invalid token objects', () => {
      expect(isToken({})).toBe(false);
      expect(
        isToken({
          address: '0x123', // invalid address
          chainId: 1,
          decimals: 18,
          symbol: 'ETH',
          name: 'Ethereum',
        })
      ).toBe(false);
    });
  });
});

describe('Validation Type Guards', () => {
  describe('isEmail', () => {
    it('should return true for valid emails', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('invalid@')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://localhost:3000')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isUrl('invalid')).toBe(false);
      expect(isUrl('example.com')).toBe(false);
    });
  });

  describe('isUuid', () => {
    it('should return true for valid UUIDs', () => {
      expect(isUuid('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUIDs', () => {
      expect(isUuid('invalid')).toBe(false);
      expect(isUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(isPositive(1)).toBe(true);
      expect(isPositive(0.1)).toBe(true);
    });

    it('should return false for non-positive numbers', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-1)).toBe(false);
    });
  });

  describe('isNonNegative', () => {
    it('should return true for non-negative numbers', () => {
      expect(isNonNegative(0)).toBe(true);
      expect(isNonNegative(1)).toBe(true);
    });

    it('should return false for negative numbers', () => {
      expect(isNonNegative(-1)).toBe(false);
      expect(isNonNegative(-0.1)).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should return true for integers', () => {
      expect(isInteger(0)).toBe(true);
      expect(isInteger(100)).toBe(true);
      expect(isInteger(-50)).toBe(true);
    });

    it('should return false for non-integers', () => {
      expect(isInteger(1.5)).toBe(false);
      expect(isInteger(0.1)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should return true for values in range', () => {
      expect(isInRange(5, 0, 10)).toBe(true);
      expect(isInRange(0, 0, 10)).toBe(true);
      expect(isInRange(10, 0, 10)).toBe(true);
    });

    it('should return false for values out of range', () => {
      expect(isInRange(-1, 0, 10)).toBe(false);
      expect(isInRange(11, 0, 10)).toBe(false);
    });
  });
});

describe('Amount Validation', () => {
  describe('isValidAmount', () => {
    it('should return true for valid amounts', () => {
      expect(isValidAmount('100')).toBe(true);
      expect(isValidAmount('100.5')).toBe(true);
      expect(isValidAmount('0.001')).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(isValidAmount('')).toBe(false);
      expect(isValidAmount('abc')).toBe(false);
      expect(isValidAmount('-100')).toBe(false);
    });
  });

  describe('isPositiveAmount', () => {
    it('should return true for positive amounts', () => {
      expect(isPositiveAmount('100')).toBe(true);
      expect(isPositiveAmount('0.001')).toBe(true);
    });

    it('should return false for zero or negative amounts', () => {
      expect(isPositiveAmount('0')).toBe(false);
      expect(isPositiveAmount('-100')).toBe(false);
    });
  });

  describe('hasValidDecimals', () => {
    it('should return true for valid decimals', () => {
      expect(hasValidDecimals('100.12', 2)).toBe(true);
      expect(hasValidDecimals('100', 2)).toBe(true);
    });

    it('should return false for too many decimals', () => {
      expect(hasValidDecimals('100.123', 2)).toBe(false);
    });
  });
});

describe('Array Type Guards', () => {
  describe('isArrayOf', () => {
    it('should validate array elements', () => {
      expect(isArrayOf(['a', 'b'], isString)).toBe(true);
      expect(isArrayOf([1, 2, 3], isNumber)).toBe(true);
    });

    it('should return false for mixed arrays', () => {
      expect(isArrayOf(['a', 1], isString)).toBe(false);
    });
  });

  describe('isNonEmptyArray', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true);
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    });

    it('should return false for empty arrays', () => {
      expect(isNonEmptyArray([])).toBe(false);
    });
  });

  describe('isStringArray', () => {
    it('should return true for string arrays', () => {
      expect(isStringArray(['a', 'b', 'c'])).toBe(true);
    });

    it('should return false for non-string arrays', () => {
      expect(isStringArray([1, 2, 3])).toBe(false);
      expect(isStringArray(['a', 1])).toBe(false);
    });
  });

  describe('isNumberArray', () => {
    it('should return true for number arrays', () => {
      expect(isNumberArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-number arrays', () => {
      expect(isNumberArray(['a', 'b'])).toBe(false);
    });
  });
});

describe('Object Type Guards', () => {
  describe('hasProperty', () => {
    it('should return true if object has property', () => {
      expect(hasProperty({ a: 1 }, 'a')).toBe(true);
    });

    it('should return false if object does not have property', () => {
      expect(hasProperty({ a: 1 }, 'b')).toBe(false);
    });
  });

  describe('hasProperties', () => {
    it('should return true if object has all properties', () => {
      expect(hasProperties({ a: 1, b: 2 }, ['a', 'b'])).toBe(true);
    });

    it('should return false if object is missing properties', () => {
      expect(hasProperties({ a: 1 }, ['a', 'b'])).toBe(false);
    });
  });

  describe('isEmptyObject', () => {
    it('should return true for empty objects', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmptyObject({ a: 1 })).toBe(false);
    });
  });
});

describe('Error Type Guards', () => {
  describe('isNetworkError', () => {
    it('should return true for network errors', () => {
      expect(isNetworkError(new Error('Network error'))).toBe(true);
      expect(isNetworkError(new Error('Fetch failed'))).toBe(true);
      expect(isNetworkError(new Error('Connection timeout'))).toBe(true);
    });

    it('should return false for non-network errors', () => {
      expect(isNetworkError(new Error('Unknown error'))).toBe(false);
    });
  });

  describe('isTimeoutError', () => {
    it('should return true for timeout errors', () => {
      expect(isTimeoutError(new Error('Request timeout'))).toBe(true);
    });

    it('should return false for non-timeout errors', () => {
      expect(isTimeoutError(new Error('Unknown error'))).toBe(false);
    });
  });

  describe('isUserRejection', () => {
    it('should return true for user rejection errors', () => {
      expect(isUserRejection(new Error('User rejected the request'))).toBe(true);
      expect(isUserRejection(new Error('User denied transaction'))).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isUserRejection(new Error('Unknown error'))).toBe(false);
    });
  });

  describe('isInsufficientFunds', () => {
    it('should return true for insufficient funds errors', () => {
      expect(isInsufficientFunds(new Error('Insufficient funds'))).toBe(true);
      expect(isInsufficientFunds(new Error('Insufficient balance'))).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isInsufficientFunds(new Error('Unknown error'))).toBe(false);
    });
  });
});

describe('Assertion Functions', () => {
  describe('assertDefined', () => {
    it('should not throw for defined values', () => {
      expect(() => assertDefined(1)).not.toThrow();
      expect(() => assertDefined('')).not.toThrow();
      expect(() => assertDefined(0)).not.toThrow();
    });

    it('should throw for null or undefined', () => {
      expect(() => assertDefined(null)).toThrow();
      expect(() => assertDefined(undefined)).toThrow();
    });

    it('should use custom message', () => {
      expect(() => assertDefined(null, 'Custom message')).toThrow('Custom message');
    });
  });

  describe('assertAddress', () => {
    it('should not throw for valid addresses', () => {
      expect(() => assertAddress('0x1234567890123456789012345678901234567890')).not.toThrow();
    });

    it('should throw for invalid addresses', () => {
      expect(() => assertAddress('0x123')).toThrow();
    });
  });

  describe('assertPositive', () => {
    it('should not throw for positive numbers', () => {
      expect(() => assertPositive(1)).not.toThrow();
      expect(() => assertPositive(0.1)).not.toThrow();
    });

    it('should throw for non-positive values', () => {
      expect(() => assertPositive(0)).toThrow();
      expect(() => assertPositive(-1)).toThrow();
    });
  });
});

describe('Utility Functions', () => {
  describe('nonNull', () => {
    it('should return true for non-null values', () => {
      expect(nonNull(1)).toBe(true);
      expect(nonNull('')).toBe(true);
      expect(nonNull(0)).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(nonNull(null)).toBe(false);
      expect(nonNull(undefined)).toBe(false);
    });
  });

  describe('filterNullish', () => {
    it('should filter out null and undefined', () => {
      expect(filterNullish([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
    });

    it('should return empty array for all nullish', () => {
      expect(filterNullish([null, undefined])).toEqual([]);
    });

    it('should keep other falsy values', () => {
      expect(filterNullish([0, '', false, null])).toEqual([0, '', false]);
    });
  });
});

