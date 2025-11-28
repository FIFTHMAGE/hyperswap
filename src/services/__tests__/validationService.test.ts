/**
 * Validation Service tests
 */

import { describe, expect, it } from 'vitest';

import { ValidationService } from '../core/validation/validation.service';

describe('ValidationService', () => {
  const validator = new ValidationService();

  describe('isValidAddress', () => {
    it('should validate correct Ethereum address', () => {
      expect(validator.isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9')).toBe(true);
    });

    it('should validate lowercase address', () => {
      expect(validator.isValidAddress('0x742d35cc6634c0532925a3b844bc9e7595f0beb9')).toBe(true);
    });

    it('should validate uppercase address', () => {
      expect(validator.isValidAddress('0x742D35CC6634C0532925A3B844BC9E7595F0BEB9')).toBe(true);
    });

    it('should reject address without 0x prefix', () => {
      expect(validator.isValidAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb9')).toBe(false);
    });

    it('should reject short addresses', () => {
      expect(validator.isValidAddress('0x123')).toBe(false);
      expect(validator.isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0b')).toBe(false);
    });

    it('should reject long addresses', () => {
      expect(validator.isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9aa')).toBe(false);
    });

    it('should reject invalid characters', () => {
      expect(validator.isValidAddress('0x742d35Gg6634C0532925a3b844Bc9e7595f0bEb9')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validator.isValidAddress('')).toBe(false);
    });

    it('should reject null/undefined', () => {
      expect(validator.isValidAddress(null as unknown as string)).toBe(false);
      expect(validator.isValidAddress(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidTxHash', () => {
    it('should validate correct transaction hash', () => {
      const hash = '0x742d35cc6634c0532925a3b844bc9e7595f0beb9742d35cc6634c0532925a3b8';
      expect(validator.isValidTxHash(hash)).toBe(true);
    });

    it('should reject short hashes', () => {
      expect(validator.isValidTxHash('0x123')).toBe(false);
    });

    it('should reject hash without 0x prefix', () => {
      const hash = '742d35cc6634c0532925a3b844bc9e7595f0beb9742d35cc6634c0532925a3b8';
      expect(validator.isValidTxHash(hash)).toBe(false);
    });

    it('should reject invalid characters', () => {
      const hash = '0xzzzz35cc6634c0532925a3b844bc9e7595f0beb9742d35cc6634c0532925a3b8';
      expect(validator.isValidTxHash(hash)).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should validate positive integers', () => {
      expect(validator.isValidAmount('100')).toBe(true);
      expect(validator.isValidAmount('1')).toBe(true);
      expect(validator.isValidAmount('999999999')).toBe(true);
    });

    it('should validate positive decimals', () => {
      expect(validator.isValidAmount('1.5')).toBe(true);
      expect(validator.isValidAmount('0.001')).toBe(true);
      expect(validator.isValidAmount('0.000000000000000001')).toBe(true);
    });

    it('should validate zero', () => {
      expect(validator.isValidAmount('0')).toBe(true);
      expect(validator.isValidAmount('0.0')).toBe(true);
    });

    it('should reject negative numbers', () => {
      expect(validator.isValidAmount('-1')).toBe(false);
      expect(validator.isValidAmount('-0.5')).toBe(false);
    });

    it('should reject non-numeric strings', () => {
      expect(validator.isValidAmount('abc')).toBe(false);
      expect(validator.isValidAmount('1a2b')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validator.isValidAmount('')).toBe(false);
    });
  });

  describe('isValidChainId', () => {
    it('should validate known chain IDs', () => {
      expect(validator.isValidChainId(1)).toBe(true); // Ethereum
      expect(validator.isValidChainId(137)).toBe(true); // Polygon
      expect(validator.isValidChainId(56)).toBe(true); // BSC
      expect(validator.isValidChainId(42161)).toBe(true); // Arbitrum
    });

    it('should validate any positive integer', () => {
      expect(validator.isValidChainId(12345)).toBe(true);
    });

    it('should reject invalid chain IDs', () => {
      expect(validator.isValidChainId(0)).toBe(false);
      expect(validator.isValidChainId(-1)).toBe(false);
      expect(validator.isValidChainId(1.5)).toBe(false);
    });
  });

  describe('isValidSlippage', () => {
    it('should validate normal slippage values', () => {
      expect(validator.isValidSlippage(0.1)).toBe(true);
      expect(validator.isValidSlippage(0.5)).toBe(true);
      expect(validator.isValidSlippage(1)).toBe(true);
      expect(validator.isValidSlippage(5)).toBe(true);
    });

    it('should reject zero slippage', () => {
      expect(validator.isValidSlippage(0)).toBe(false);
    });

    it('should reject negative slippage', () => {
      expect(validator.isValidSlippage(-1)).toBe(false);
    });

    it('should reject excessive slippage', () => {
      expect(validator.isValidSlippage(100)).toBe(false);
      expect(validator.isValidSlippage(50.1)).toBe(false);
    });
  });

  describe('isValidTokenSymbol', () => {
    it('should validate common symbols', () => {
      expect(validator.isValidTokenSymbol('ETH')).toBe(true);
      expect(validator.isValidTokenSymbol('USDC')).toBe(true);
      expect(validator.isValidTokenSymbol('WBTC')).toBe(true);
    });

    it('should allow lowercase', () => {
      expect(validator.isValidTokenSymbol('eth')).toBe(true);
    });

    it('should allow numbers', () => {
      expect(validator.isValidTokenSymbol('LINK2')).toBe(true);
    });

    it('should reject too long symbols', () => {
      expect(validator.isValidTokenSymbol('THISISAVERYLONGSYMBOL')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validator.isValidTokenSymbol('')).toBe(false);
    });

    it('should reject special characters', () => {
      expect(validator.isValidTokenSymbol('ETH!')).toBe(false);
      expect(validator.isValidTokenSymbol('ETH@USDC')).toBe(false);
    });
  });

  describe('isValidDeadline', () => {
    it('should validate future timestamps', () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      expect(validator.isValidDeadline(future)).toBe(true);
    });

    it('should reject past timestamps', () => {
      const past = Math.floor(Date.now() / 1000) - 3600;
      expect(validator.isValidDeadline(past)).toBe(false);
    });

    it('should reject current timestamp', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(validator.isValidDeadline(now)).toBe(false);
    });

    it('should reject timestamps too far in future', () => {
      const farFuture = Math.floor(Date.now() / 1000) + 365 * 24 * 3600;
      expect(validator.isValidDeadline(farFuture)).toBe(false);
    });
  });

  describe('validateSwapParams', () => {
    const validParams = {
      fromToken: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9',
      toToken: '0x456d35Cc6634C0532925a3b844Bc9e7595f0bEb9',
      amount: '1000000000000000000',
      slippage: 0.5,
      deadline: Math.floor(Date.now() / 1000) + 1200,
    };

    it('should validate correct swap params', () => {
      const result = validator.validateSwapParams(validParams);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid fromToken', () => {
      const result = validator.validateSwapParams({
        ...validParams,
        fromToken: 'invalid',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid from token address');
    });

    it('should reject invalid toToken', () => {
      const result = validator.validateSwapParams({
        ...validParams,
        toToken: 'invalid',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid to token address');
    });

    it('should reject invalid amount', () => {
      const result = validator.validateSwapParams({
        ...validParams,
        amount: '-100',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid amount');
    });

    it('should reject same tokens', () => {
      const result = validator.validateSwapParams({
        ...validParams,
        toToken: validParams.fromToken,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Cannot swap token to itself');
    });

    it('should collect multiple errors', () => {
      const result = validator.validateSwapParams({
        fromToken: 'invalid1',
        toToken: 'invalid2',
        amount: '-1',
        slippage: 100,
        deadline: Math.floor(Date.now() / 1000) - 100,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>';
      expect(validator.sanitizeInput(input)).not.toContain('<script>');
    });

    it('should trim whitespace', () => {
      expect(validator.sanitizeInput('  test  ')).toBe('test');
    });

    it('should handle null/undefined', () => {
      expect(validator.sanitizeInput(null as unknown as string)).toBe('');
      expect(validator.sanitizeInput(undefined as unknown as string)).toBe('');
    });

    it('should preserve normal text', () => {
      expect(validator.sanitizeInput('Hello World')).toBe('Hello World');
    });
  });
});

