/**
 * Number formatting utilities
 * @module utils/format/number
 */

/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-US', options).format(value);
}

/**
 * Format a number with compact notation (e.g., 1.2K, 3.4M)
 */
export function formatCompact(value: number, decimals: number = 1): string {
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(decimals)}K`;
  }
  
  return formatNumber(value, { maximumFractionDigits: decimals });
}

/**
 * Format a large number (token amount)
 */
export function formatLargeNumber(value: string | number, decimals: number = 18): string {
  const numValue = typeof value === 'string' ? BigInt(value) : BigInt(Math.floor(value));
  const divisor = BigInt(10 ** decimals);
  const integerPart = numValue / divisor;
  const fractionalPart = numValue % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Format number with significant digits
 */
export function formatSignificant(value: number, significantDigits: number = 6): string {
  if (value === 0) return '0';
  
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: significantDigits,
    notation: 'standard',
  }).format(value);
}

/**
 * Format number with fixed decimals
 */
export function formatFixed(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format number with thousands separators
 */
export function formatWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return formatNumber(num, { minimumFractionDigits: 0 });
}

/**
 * Format token balance with smart precision
 */
export function formatBalance(balance: string | number, decimals: number = 18): string {
  const formatted = formatLargeNumber(balance, decimals);
  const num = parseFloat(formatted);
  
  if (num === 0) return '0';
  if (num < 0.000001) return '< 0.000001';
  if (num < 1) return formatSignificant(num, 4);
  if (num < 1000) return formatFixed(num, 4);
  
  return formatCompact(num, 2);
}

/**
 * Parse formatted number string back to number
 */
export function parseFormattedNumber(value: string): number {
  // Remove commas and spaces
  const cleaned = value.replace(/[,\s]/g, '');
  return parseFloat(cleaned);
}

