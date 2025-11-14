/**
 * Format utilities tests
 */

import { describe, it, expect } from 'vitest';
import { formatNumber } from '../format/number';
import { formatUSD } from '../format/currency';
import { formatPercentage } from '../format/percentage';
import { formatAddress } from '../format/address';

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    it('formats large numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles decimals correctly', () => {
      expect(formatNumber(1234.56)).toContain('1,234');
    });
  });

  describe('formatUSD', () => {
    it('formats USD amounts', () => {
      expect(formatUSD(1000)).toBe('$1,000.00');
      expect(formatUSD(0.99)).toBe('$0.99');
    });

    it('handles large amounts', () => {
      const formatted = formatUSD(1000000);
      expect(formatted).toContain('$1');
      expect(formatted).toContain('000');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentages', () => {
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(0.123)).toBe('12.30%');
    });

    it('handles negative percentages', () => {
      expect(formatPercentage(-0.25)).toBe('-25.00%');
    });
  });

  describe('formatAddress', () => {
    it('truncates Ethereum addresses', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = formatAddress(address);
      expect(formatted).toMatch(/^0x[0-9a-fA-F]{4}\.\.\.[0-9a-fA-F]{4}$/);
    });

    it('handles short addresses', () => {
      const address = '0x1234';
      expect(formatAddress(address)).toBe(address);
    });
  });
});

