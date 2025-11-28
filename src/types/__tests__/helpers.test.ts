/**
 * Type helpers tests
 */

import { describe, expect, it } from 'vitest';

import {
  formatTokenAmount,
  parseTokenAmount,
  getTokenKey,
  isSameAddress,
  isNativeToken,
  truncateAddress,
  calculatePercentageChange,
  safeDivide,
} from '../helpers';

import type { Token } from '../token';

const mockToken: Token = {
  address: '0x1234567890123456789012345678901234567890',
  symbol: 'TEST',
  name: 'Test Token',
  decimals: 18,
  chainId: 1,
};

describe('formatTokenAmount', () => {
  describe('18 decimals', () => {
    it('should format whole numbers', () => {
      // 1 token = 1e18 wei
      expect(formatTokenAmount('1000000000000000000', 18)).toBe('1');
      expect(formatTokenAmount('5000000000000000000', 18)).toBe('5');
    });

    it('should format decimal amounts', () => {
      // 1.5 tokens = 1.5e18 wei
      expect(formatTokenAmount('1500000000000000000', 18)).toBe('1.5');
    });

    it('should handle small amounts', () => {
      // 0.001 tokens
      expect(formatTokenAmount('1000000000000000', 18)).toBe('0.001');
    });

    it('should remove trailing zeros', () => {
      expect(formatTokenAmount('1000000000000000000', 18)).toBe('1');
      expect(formatTokenAmount('1100000000000000000', 18)).toBe('1.1');
    });

    it('should handle zero', () => {
      expect(formatTokenAmount('0', 18)).toBe('0');
    });
  });

  describe('6 decimals (USDC)', () => {
    it('should format whole numbers', () => {
      // 1 USDC = 1e6
      expect(formatTokenAmount('1000000', 6)).toBe('1');
    });

    it('should format decimal amounts', () => {
      // 1.5 USDC
      expect(formatTokenAmount('1500000', 6)).toBe('1.5');
    });

    it('should handle cents', () => {
      // $0.01
      expect(formatTokenAmount('10000', 6)).toBe('0.01');
    });
  });

  describe('8 decimals (WBTC)', () => {
    it('should format BTC amounts', () => {
      // 1 BTC = 1e8 satoshis
      expect(formatTokenAmount('100000000', 8)).toBe('1');
      expect(formatTokenAmount('50000000', 8)).toBe('0.5');
    });
  });
});

describe('parseTokenAmount', () => {
  describe('18 decimals', () => {
    it('should parse whole numbers', () => {
      expect(parseTokenAmount('1', 18)).toBe('1000000000000000000');
      expect(parseTokenAmount('5', 18)).toBe('5000000000000000000');
    });

    it('should parse decimal amounts', () => {
      expect(parseTokenAmount('1.5', 18)).toBe('1500000000000000000');
    });

    it('should parse small amounts', () => {
      expect(parseTokenAmount('0.001', 18)).toBe('1000000000000000');
    });

    it('should handle zero', () => {
      expect(parseTokenAmount('0', 18)).toBe('0');
    });

    it('should handle amounts with no decimal part', () => {
      expect(parseTokenAmount('100', 18)).toBe('100000000000000000000');
    });
  });

  describe('6 decimals (USDC)', () => {
    it('should parse USDC amounts', () => {
      expect(parseTokenAmount('1', 6)).toBe('1000000');
      expect(parseTokenAmount('1.5', 6)).toBe('1500000');
      expect(parseTokenAmount('0.01', 6)).toBe('10000');
    });
  });

  describe('8 decimals (WBTC)', () => {
    it('should parse BTC amounts', () => {
      expect(parseTokenAmount('1', 8)).toBe('100000000');
      expect(parseTokenAmount('0.5', 8)).toBe('50000000');
    });
  });
});

describe('getTokenKey', () => {
  it('should create key from token object', () => {
    const key = getTokenKey(mockToken);
    expect(key).toBe('1:0x1234567890123456789012345678901234567890');
  });

  it('should create key from address and chainId', () => {
    const key = getTokenKey('0xABCDEF1234567890ABCDEF1234567890ABCDEF12', 137);
    expect(key).toBe('137:0xabcdef1234567890abcdef1234567890abcdef12');
  });

  it('should lowercase the address', () => {
    const key = getTokenKey('0xABCDEF1234567890ABCDEF1234567890ABCDEF12', 1);
    expect(key).toBe('1:0xabcdef1234567890abcdef1234567890abcdef12');
  });

  it('should default chainId to 1 for address string', () => {
    const key = getTokenKey('0x1234567890123456789012345678901234567890');
    expect(key).toBe('1:0x1234567890123456789012345678901234567890');
  });
});

describe('isSameAddress', () => {
  it('should return true for same addresses', () => {
    expect(
      isSameAddress(
        '0x1234567890123456789012345678901234567890',
        '0x1234567890123456789012345678901234567890'
      )
    ).toBe(true);
  });

  it('should ignore case', () => {
    expect(
      isSameAddress(
        '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12',
        '0xabcdef1234567890abcdef1234567890abcdef12'
      )
    ).toBe(true);
  });

  it('should return false for different addresses', () => {
    expect(
      isSameAddress(
        '0x1234567890123456789012345678901234567890',
        '0x0987654321098765432109876543210987654321'
      )
    ).toBe(false);
  });
});

describe('isNativeToken', () => {
  describe('with token object', () => {
    it('should return true for ETH-like native token (0xEee...)', () => {
      const nativeToken: Token = {
        ...mockToken,
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      };
      expect(isNativeToken(nativeToken)).toBe(true);
    });

    it('should return true for zero address native token', () => {
      const nativeToken: Token = {
        ...mockToken,
        address: '0x0000000000000000000000000000000000000000',
      };
      expect(isNativeToken(nativeToken)).toBe(true);
    });

    it('should return false for ERC20 token', () => {
      expect(isNativeToken(mockToken)).toBe(false);
    });
  });

  describe('with address string', () => {
    it('should return true for native token addresses', () => {
      expect(isNativeToken('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')).toBe(true);
      expect(isNativeToken('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should return false for regular addresses', () => {
      expect(isNativeToken('0x1234567890123456789012345678901234567890')).toBe(false);
    });
  });
});

describe('truncateAddress', () => {
  const fullAddress = '0x1234567890123456789012345678901234567890';

  it('should truncate address with default parameters', () => {
    expect(truncateAddress(fullAddress)).toBe('0x1234...7890');
  });

  it('should truncate with custom start chars', () => {
    expect(truncateAddress(fullAddress, 10)).toBe('0x12345678...7890');
  });

  it('should truncate with custom end chars', () => {
    expect(truncateAddress(fullAddress, 6, 6)).toBe('0x1234...567890');
  });

  it('should return full address if shorter than truncation', () => {
    const shortAddress = '0x1234';
    expect(truncateAddress(shortAddress, 6, 4)).toBe(shortAddress);
  });

  it('should handle edge cases', () => {
    expect(truncateAddress(fullAddress, 0, 0)).toBe('...');
    expect(truncateAddress(fullAddress, 2, 2)).toBe('0x...90');
  });
});

describe('calculatePercentageChange', () => {
  it('should calculate positive change', () => {
    expect(calculatePercentageChange(100, 150)).toBe(50);
    expect(calculatePercentageChange(100, 200)).toBe(100);
  });

  it('should calculate negative change', () => {
    expect(calculatePercentageChange(100, 50)).toBe(-50);
    expect(calculatePercentageChange(100, 0)).toBe(-100);
  });

  it('should handle no change', () => {
    expect(calculatePercentageChange(100, 100)).toBe(0);
  });

  it('should handle zero old value', () => {
    expect(calculatePercentageChange(0, 100)).toBe(100);
    expect(calculatePercentageChange(0, 0)).toBe(0);
  });

  it('should handle decimal values', () => {
    expect(calculatePercentageChange(100, 110)).toBe(10);
    expect(calculatePercentageChange(1.5, 3)).toBe(100);
  });
});

describe('safeDivide', () => {
  it('should perform normal division', () => {
    expect(safeDivide(10, 2)).toBe(5);
    expect(safeDivide(100, 4)).toBe(25);
  });

  it('should return 0 when dividing by zero', () => {
    expect(safeDivide(10, 0)).toBe(0);
    expect(safeDivide(0, 0)).toBe(0);
  });

  it('should handle decimal results', () => {
    expect(safeDivide(1, 3)).toBeCloseTo(0.333, 2);
    expect(safeDivide(10, 3)).toBeCloseTo(3.333, 2);
  });

  it('should handle negative values', () => {
    expect(safeDivide(-10, 2)).toBe(-5);
    expect(safeDivide(10, -2)).toBe(-5);
    expect(safeDivide(-10, -2)).toBe(5);
  });

  it('should return 0 for 0 numerator', () => {
    expect(safeDivide(0, 5)).toBe(0);
  });
});

