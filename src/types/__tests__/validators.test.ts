/**
 * Validators tests
 */

import { describe, expect, it } from 'vitest';

import {
  ADDRESS_REGEX,
  TX_HASH_REGEX,
  ValidationRules,
  validateAddress,
  validateAmount,
  validateSlippage,
  validateDeadline,
} from '../validators';

describe('Regex Patterns', () => {
  describe('ADDRESS_REGEX', () => {
    it('should match valid Ethereum addresses', () => {
      expect(ADDRESS_REGEX.test('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(ADDRESS_REGEX.test('0xABCDEF1234567890abcdef1234567890ABCDEF12')).toBe(true);
    });

    it('should not match invalid addresses', () => {
      expect(ADDRESS_REGEX.test('0x123')).toBe(false);
      expect(ADDRESS_REGEX.test('1234567890123456789012345678901234567890')).toBe(false);
      expect(ADDRESS_REGEX.test('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false);
      expect(ADDRESS_REGEX.test('0x12345678901234567890123456789012345678901')).toBe(false);
    });
  });

  describe('TX_HASH_REGEX', () => {
    it('should match valid transaction hashes', () => {
      expect(
        TX_HASH_REGEX.test('0x1234567890123456789012345678901234567890123456789012345678901234')
      ).toBe(true);
    });

    it('should not match invalid transaction hashes', () => {
      expect(TX_HASH_REGEX.test('0x123')).toBe(false);
      expect(TX_HASH_REGEX.test('0x1234567890123456789012345678901234567890')).toBe(false);
    });
  });
});

describe('ValidationRules', () => {
  it('should have correct address validation rule', () => {
    expect(ValidationRules.address.pattern).toBe(ADDRESS_REGEX);
    expect(ValidationRules.address.message).toBe('Invalid Ethereum address format');
  });

  it('should have correct txHash validation rule', () => {
    expect(ValidationRules.txHash.pattern).toBe(TX_HASH_REGEX);
    expect(ValidationRules.txHash.message).toBe('Invalid transaction hash format');
  });

  it('should have correct amount validation rule', () => {
    expect(ValidationRules.amount.min).toBe(0);
    expect(ValidationRules.amount.message).toBe('Amount must be positive');
  });

  it('should have correct slippage validation rule', () => {
    expect(ValidationRules.slippage.min).toBe(0.01);
    expect(ValidationRules.slippage.max).toBe(50);
    expect(ValidationRules.slippage.message).toBe('Slippage must be between 0.01% and 50%');
  });

  it('should have correct deadline validation rule', () => {
    expect(ValidationRules.deadline.min).toBe(1);
    expect(ValidationRules.deadline.max).toBe(4320);
    expect(ValidationRules.deadline.message).toBe('Deadline must be between 1 minute and 3 days');
  });
});

describe('validateAddress', () => {
  describe('valid addresses', () => {
    it('should return valid for correct addresses', () => {
      const result = validateAddress('0x1234567890123456789012345678901234567890');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle mixed case addresses', () => {
      const result = validateAddress('0xAbCdEf1234567890AbCdEf1234567890AbCdEf12');
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid addresses', () => {
    it('should return invalid for empty address', () => {
      const result = validateAddress('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Address is required');
    });

    it('should return invalid for non-string address', () => {
      const result = validateAddress(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Address is required');
    });

    it('should return invalid for address without 0x prefix', () => {
      const result = validateAddress('1234567890123456789012345678901234567890');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid Ethereum address format');
    });

    it('should return invalid for address with wrong length', () => {
      const result = validateAddress('0x123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid Ethereum address format');
    });

    it('should return invalid for address with invalid characters', () => {
      const result = validateAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid Ethereum address format');
    });
  });
});

describe('validateAmount', () => {
  describe('valid amounts', () => {
    it('should return valid for positive string amounts', () => {
      const result = validateAmount('100');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for positive number amounts', () => {
      const result = validateAmount(100);
      expect(result.valid).toBe(true);
    });

    it('should return valid for decimal amounts', () => {
      const result = validateAmount('100.5');
      expect(result.valid).toBe(true);
    });

    it('should return valid for zero amount', () => {
      const result = validateAmount(0);
      expect(result.valid).toBe(true);
    });

    it('should return valid for small amounts', () => {
      const result = validateAmount('0.000001');
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid amounts', () => {
    it('should return invalid for non-numeric string', () => {
      const result = validateAmount('abc');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid amount format');
    });

    it('should return invalid for negative amounts', () => {
      const result = validateAmount(-100);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Amount must be positive');
    });

    it('should return invalid for NaN', () => {
      const result = validateAmount(NaN);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid amount format');
    });
  });
});

describe('validateSlippage', () => {
  describe('valid slippage', () => {
    it('should return valid for minimum slippage', () => {
      const result = validateSlippage(0.01);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for maximum slippage', () => {
      const result = validateSlippage(50);
      expect(result.valid).toBe(true);
    });

    it('should return valid for common slippage values', () => {
      expect(validateSlippage(0.5).valid).toBe(true);
      expect(validateSlippage(1).valid).toBe(true);
      expect(validateSlippage(5).valid).toBe(true);
    });
  });

  describe('invalid slippage', () => {
    it('should return invalid for slippage below minimum', () => {
      const result = validateSlippage(0.005);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Slippage must be between 0.01% and 50%');
    });

    it('should return invalid for slippage above maximum', () => {
      const result = validateSlippage(51);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Slippage must be between 0.01% and 50%');
    });

    it('should return invalid for negative slippage', () => {
      const result = validateSlippage(-1);
      expect(result.valid).toBe(false);
    });

    it('should return invalid for zero slippage', () => {
      const result = validateSlippage(0);
      expect(result.valid).toBe(false);
    });
  });
});

describe('validateDeadline', () => {
  describe('valid deadline', () => {
    it('should return valid for minimum deadline', () => {
      const result = validateDeadline(1);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for maximum deadline', () => {
      const result = validateDeadline(4320);
      expect(result.valid).toBe(true);
    });

    it('should return valid for common deadline values', () => {
      expect(validateDeadline(5).valid).toBe(true);
      expect(validateDeadline(10).valid).toBe(true);
      expect(validateDeadline(20).valid).toBe(true);
      expect(validateDeadline(30).valid).toBe(true);
    });
  });

  describe('invalid deadline', () => {
    it('should return invalid for deadline below minimum', () => {
      const result = validateDeadline(0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline must be between 1 minute and 3 days');
    });

    it('should return invalid for deadline above maximum', () => {
      const result = validateDeadline(4321);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline must be between 1 minute and 3 days');
    });

    it('should return invalid for negative deadline', () => {
      const result = validateDeadline(-1);
      expect(result.valid).toBe(false);
    });
  });
});

