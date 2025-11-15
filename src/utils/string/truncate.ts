/**
 * String truncation utilities
 * @module utils/string
 */

export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

export function truncateMiddle(
  str: string,
  startChars = 6,
  endChars = 4,
  separator = '...'
): string {
  if (str.length <= startChars + endChars + separator.length) return str;
  return `${str.slice(0, startChars)}${separator}${str.slice(-endChars)}`;
}

export function truncateAddress(address: string): string {
  return truncateMiddle(address, 6, 4);
}
