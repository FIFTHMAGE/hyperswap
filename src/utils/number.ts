/**
 * Number Utilities
 * Helper functions for number formatting and calculations
 */

/**
 * Format number with commas
 */
export function formatWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format number as currency
 */
export function formatCurrency(
  num: number,
  currency: string = 'USD',
  decimals: number = 2
): string {
  const formatted = num.toFixed(decimals);
  const withCommas = formatWithCommas(parseFloat(formatted));

  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${withCommas}`;
}

/**
 * Format number as percentage
 */
export function formatPercentage(num: number, decimals: number = 2): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Round to specified decimals
 */
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Check if number is in range
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * Convert to abbreviation (1K, 1M, 1B)
 */
export function toAbbreviation(num: number, decimals: number = 1): string {
  if (num >= 1e12) return `${roundTo(num / 1e12, decimals)}T`;
  if (num >= 1e9) return `${roundTo(num / 1e9, decimals)}B`;
  if (num >= 1e6) return `${roundTo(num / 1e6, decimals)}M`;
  if (num >= 1e3) return `${roundTo(num / 1e3, decimals)}K`;
  return num.toString();
}

/**
 * Parse abbreviated number (1K, 1M, 1B)
 */
export function parseAbbreviation(str: string): number {
  const multipliers: Record<string, number> = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };

  const match = str.match(/^([\d.]+)([KMBT])$/i);
  if (!match) return parseFloat(str);

  const [, value, unit] = match;
  return parseFloat(value) * (multipliers[unit.toUpperCase()] || 1);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Get median of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Get sum of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

/**
 * Get minimum value
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

/**
 * Get maximum value
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Generate random number in range
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer in range
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1));
}

/**
 * Check if number is even
 */
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

/**
 * Check if number is odd
 */
export function isOdd(num: number): boolean {
  return num % 2 !== 0;
}

/**
 * Check if number is prime
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

/**
 * Calculate factorial
 */
export function factorial(num: number): number {
  if (num <= 1) return 1;
  return num * factorial(num - 1);
}

/**
 * Calculate power
 */
export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

/**
 * Calculate square root
 */
export function sqrt(num: number): number {
  return Math.sqrt(num);
}

/**
 * Calculate absolute value
 */
export function abs(num: number): number {
  return Math.abs(num);
}

/**
 * Check if numbers are approximately equal
 */
export function approximatelyEqual(a: number, b: number, epsilon: number = 1e-10): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Normalize value to 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
