/**
 * Calculation utilities tests
 */

import {
  percentage,
  percentageChange,
  clamp,
  roundTo,
  average,
  median,
  standardDeviation,
  lerp,
  mapRange,
} from '@/utils/calculation';

describe('Calculation Utilities', () => {
  test('calculates percentage', () => {
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(50, 200)).toBe(25);
    expect(percentage(10, 0)).toBe(0);
  });

  test('calculates percentage change', () => {
    expect(percentageChange(100, 150)).toBe(50);
    expect(percentageChange(200, 100)).toBe(-50);
    expect(percentageChange(0, 100)).toBe(0);
  });

  test('clamps values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('rounds to decimals', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(1.5555, 3)).toBe(1.556);
  });

  test('calculates average', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
    expect(average([10, 20, 30])).toBe(20);
    expect(average([])).toBe(0);
  });

  test('calculates median', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBe(0);
  });

  test('calculates standard deviation', () => {
    const result = standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(result).toBeCloseTo(2, 0);
  });

  test('performs linear interpolation', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.25)).toBe(12.5);
  });

  test('maps value between ranges', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    expect(mapRange(2, 0, 10, 100, 200)).toBe(120);
  });
});
