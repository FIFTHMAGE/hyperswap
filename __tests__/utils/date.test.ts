/**
 * Date utilities tests
 */

import {
  getTimestamp,
  msToSeconds,
  secondsToMs,
  isToday,
  startOfDay,
  endOfDay,
  addDays,
  diffInDays,
} from '@/utils/date';

describe('Date Utilities', () => {
  test('gets current timestamp', () => {
    const timestamp = getTimestamp();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThan(0);
  });

  test('converts milliseconds to seconds', () => {
    expect(msToSeconds(5000)).toBe(5);
    expect(msToSeconds(1500)).toBe(1);
  });

  test('converts seconds to milliseconds', () => {
    expect(secondsToMs(5)).toBe(5000);
    expect(secondsToMs(1.5)).toBe(1500);
  });

  test('checks if date is today', () => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    expect(isToday(today)).toBe(true);
    expect(isToday(yesterday)).toBe(false);
  });

  test('gets start of day', () => {
    const date = new Date('2024-01-15T15:30:00');
    const start = startOfDay(date);
    const startDate = new Date(start);

    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);
  });

  test('gets end of day', () => {
    const date = new Date('2024-01-15T15:30:00');
    const end = endOfDay(date);
    const endDate = new Date(end);

    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
  });

  test('adds days to date', () => {
    const date = new Date('2024-01-15');
    const result = addDays(date, 5);

    expect(result.getDate()).toBe(20);
  });

  test('calculates difference in days', () => {
    const date1 = new Date('2024-01-20');
    const date2 = new Date('2024-01-15');

    expect(diffInDays(date1, date2)).toBe(5);
  });
});
