import {
  shortenAddress,
  isValidAddress,
  compareAddresses,
  formatTokenAmount,
  weiToEther,
} from '@/lib/utils/crypto';

describe('crypto utilities', () => {
  describe('shortenAddress', () => {
    it('should shorten addresses correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(shortenAddress(address)).toBe('0x1234...7890');
      expect(shortenAddress(address, 6)).toBe('0x123456...567890');
    });

    it('should handle empty addresses', () => {
      expect(shortenAddress('')).toBe('');
    });
  });

  describe('isValidAddress', () => {
    it('should validate Ethereum addresses', () => {
      expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('invalid')).toBe(false);
    });
  });

  describe('compareAddresses', () => {
    it('should compare addresses case-insensitively', () => {
      const addr1 = '0xABCD1234567890123456789012345678901234EF';
      const addr2 = '0xabcd1234567890123456789012345678901234ef';
      expect(compareAddresses(addr1, addr2)).toBe(true);
    });
  });

  describe('formatTokenAmount', () => {
    it('should format token amounts', () => {
      expect(formatTokenAmount('1000000000000000000', 18)).toBe('1.0000');
      expect(formatTokenAmount(1000000, 6)).toBe('1.0000');
    });
  });

  describe('weiToEther', () => {
    it('should convert wei to ether', () => {
      expect(weiToEther('1000000000000000000')).toBe('1.000000');
      expect(weiToEther(BigInt('2000000000000000000'))).toBe('2.000000');
    });
  });
});
