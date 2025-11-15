/**
 * Formatting utilities tests
 */

import { formatTokenAmount, formatTimeAgo, formatDuration } from '@/utils/formatting';

describe('Token Formatting', () => {
  test('formats token amounts correctly', () => {
    const result = formatTokenAmount('1000000000000000000', 18);
    expect(result).toBe('1.00');
  });

  test('handles small amounts', () => {
    const result = formatTokenAmount('1000', 18);
    expect(result).toContain('0.000001');
  });
});

describe('Time Formatting', () => {
  test('formats time ago correctly', () => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    expect(formatTimeAgo(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  test('formats duration correctly', () => {
    expect(formatDuration(5000)).toBe('5s');
    expect(formatDuration(65000)).toBe('1m');
    expect(formatDuration(3665000)).toBe('1h');
  });
});
