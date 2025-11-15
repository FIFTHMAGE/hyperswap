/**
 * Token formatting utilities
 * @module utils/formatting/token
 */

/**
 * Format token symbol for display (uppercase, trim)
 */
export function formatTokenSymbol(symbol: string): string {
  return symbol.toUpperCase().trim();
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number = 18,
  maxDecimals: number = 6
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) return '0';

  // Convert from wei-like format
  const normalized = num / Math.pow(10, decimals);

  // Format with max decimals
  if (normalized === 0) return '0';
  if (normalized < 0.000001) return '<0.000001';
  if (normalized > 1000000) return normalized.toExponential(2);

  return normalized.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: normalized < 1 ? maxDecimals : 2,
  });
}

/**
 * Format token amount in compact notation
 */
export function formatTokenCompact(amount: string | number, decimals: number = 18): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) return '0';

  const normalized = num / Math.pow(10, decimals);

  if (normalized === 0) return '0';
  if (normalized < 0.000001) return '<0.000001';

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(normalized);
}

/**
 * Format token balance with symbol
 */
export function formatTokenBalance(
  amount: string | number,
  symbol: string,
  decimals: number = 18
): string {
  const formatted = formatTokenAmount(amount, decimals);
  return `${formatted} ${formatTokenSymbol(symbol)}`;
}
