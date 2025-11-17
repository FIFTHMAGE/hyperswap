/**
 * Currency formatting utilities
 * @module utils/format/currency
 */

/**
 * Supported currencies
 */
export const CURRENCIES = {
  USD: { symbol: '$', decimals: 2 },
  EUR: { symbol: '€', decimals: 2 },
  GBP: { symbol: '£', decimals: 2 },
  JPY: { symbol: '¥', decimals: 0 },
  CNY: { symbol: '¥', decimals: 2 },
} as const;

export type Currency = keyof typeof CURRENCIES;

/**
 * Format a value as currency
 */
export function formatCurrency(
  value: number,
  currency: Currency = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
}

/**
 * Format currency with compact notation
 */
export function formatCurrencyCompact(value: number, currency: Currency = 'USD'): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const symbol = CURRENCIES[currency].symbol;

  if (absValue === 0) return `${symbol}0`;
  if (absValue < 0.01) return `< ${symbol}0.01`;
  if (absValue >= 1_000_000_000) {
    return `${sign}${symbol}${(absValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${symbol}${(absValue / 1_000_000).toFixed(2)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${symbol}${(absValue / 1_000).toFixed(2)}K`;
  }

  return formatCurrency(value, currency);
}

/**
 * Format currency with automatic precision
 */
export function formatCurrencyAuto(value: number, currency: Currency = 'USD'): string {
  const absValue = Math.abs(value);

  if (absValue === 0) return formatCurrency(0, currency);
  if (absValue < 0.01) return `< ${CURRENCIES[currency].symbol}0.01`;
  if (absValue < 1)
    return formatCurrency(value, currency, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  if (absValue >= 10000) return formatCurrencyCompact(value, currency);

  return formatCurrency(value, currency);
}

/**
 * Format price with appropriate precision
 */
export function formatPrice(price: number, currency: Currency = 'USD'): string {
  if (price === 0) return `${CURRENCIES[currency].symbol}0.00`;
  if (price < 0.000001) return `< ${CURRENCIES[currency].symbol}0.000001`;
  if (price < 0.01)
    return formatCurrency(price, currency, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  if (price < 1)
    return formatCurrency(price, currency, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  return formatCurrency(price, currency);
}

/**
 * Format value in USD with symbol
 */
export function formatUSD(value: number): string {
  return formatCurrency(value, 'USD');
}

/**
 * Format market cap
 */
export function formatMarketCap(value: number, currency: Currency = 'USD'): string {
  return formatCurrencyCompact(value, currency);
}

/**
 * Format 24h volume
 */
export function formatVolume(value: number, currency: Currency = 'USD'): string {
  return formatCurrencyCompact(value, currency);
}
