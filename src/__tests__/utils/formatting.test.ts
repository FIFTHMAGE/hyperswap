import { formatNumber, formatCurrency, formatPercent } from '@/utils/formatting/number.formatter';

describe('Number Formatting', () => {
  it('should format numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should format percentages correctly', () => {
    expect(formatPercent(0.1234)).toBe('12.34%');
  });
});
