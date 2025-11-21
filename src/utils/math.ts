/**
 * Math utilities
 * @module utils
 */

export class MathUtil {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static round(value: number, decimals: number = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  static percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  }

  static percentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  static average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  static sum(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0);
  }

  static max(numbers: number[]): number {
    return Math.max(...numbers);
  }

  static min(numbers: number[]): number {
    return Math.min(...numbers);
  }
}
