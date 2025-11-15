/**
 * Validation utilities tests
 */

import { isValidAddress, isValidAmount, isValidEmail, isValidUrl } from '@/utils/validation';

describe('Address Validation', () => {
  test('validates correct Ethereum address', () => {
    expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false); // Invalid checksum
    expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true);
  });

  test('rejects invalid addresses', () => {
    expect(isValidAddress('0x')).toBe(false);
    expect(isValidAddress('invalid')).toBe(false);
    expect(isValidAddress('0x123')).toBe(false);
  });
});

describe('Amount Validation', () => {
  test('validates correct amounts', () => {
    expect(isValidAmount('100')).toBe(true);
    expect(isValidAmount('0.5')).toBe(true);
    expect(isValidAmount('1000.123456')).toBe(true);
  });

  test('rejects invalid amounts', () => {
    expect(isValidAmount('')).toBe(false);
    expect(isValidAmount('abc')).toBe(false);
    expect(isValidAmount('-5')).toBe(false);
  });
});

describe('Email Validation', () => {
  test('validates correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
  });

  test('rejects invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
  });
});

describe('URL Validation', () => {
  test('validates correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });

  test('rejects invalid URLs', () => {
    expect(isValidUrl('invalid')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });
});
