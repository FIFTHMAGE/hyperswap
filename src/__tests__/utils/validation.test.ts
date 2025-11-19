import { isValidTokenAddress, isValidAmount } from '@/utils/validation/token.validation';

describe('Token Validation', () => {
  it('should validate token addresses', () => {
    expect(isValidTokenAddress('0x' + '0'.repeat(40))).toBe(true);
    expect(isValidTokenAddress('invalid')).toBe(false);
  });

  it('should validate amounts', () => {
    expect(isValidAmount('100')).toBe(true);
    expect(isValidAmount('-100')).toBe(false);
    expect(isValidAmount('abc')).toBe(false);
  });
});
