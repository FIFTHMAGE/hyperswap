/**
 * Conversion utilities tests
 */

import { fromWei, toWei, gweiToWei, weiToGwei } from '@/utils/conversion';

describe('Wei Conversions', () => {
  test('converts from wei to ether', () => {
    expect(fromWei('1000000000000000000')).toBe('1');
    expect(fromWei('500000000000000000')).toBe('0.5');
  });

  test('converts from ether to wei', () => {
    expect(toWei('1')).toBe('1000000000000000000');
    expect(toWei('0.5')).toBe('500000000000000000');
  });

  test('handles gwei conversions', () => {
    expect(gweiToWei('1')).toBe('1000000000');
    expect(weiToGwei('1000000000')).toBe('1');
  });
});
