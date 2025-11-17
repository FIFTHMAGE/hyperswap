/**
 * Percentage formatting utilities
 * @module utils/format/percentage
 */

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format decimal as percentage (0.05 => 5%)
 */
export function formatDecimalAsPercentage(decimal: number, decimals: number = 2): string {
  return formatPercentage(decimal * 100, decimals);
}

/**
 * Format percentage with sign (+5.2% or -3.1%)
 */
export function formatPercentageChange(value: number, decimals: number = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format large percentage (>100%)
 */
export function formatLargePercentage(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K%`;
  if (value >= 100) return `${Math.round(value)}%`;
  return formatPercentage(value, 2);
}

/**
 * Format price impact percentage with color indicator
 */
export function formatPriceImpact(impact: number): {
  formatted: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  const absImpact = Math.abs(impact);

  let severity: 'low' | 'medium' | 'high' | 'critical';
  if (absImpact < 1) severity = 'low';
  else if (absImpact < 3) severity = 'medium';
  else if (absImpact < 5) severity = 'high';
  else severity = 'critical';

  return {
    formatted: formatPercentage(impact, 2),
    severity,
  };
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format APY/APR
 */
export function formatAPY(apy: number): string {
  if (apy >= 10000) return `${(apy / 1000).toFixed(0)}K%`;
  if (apy >= 1000) return `${(apy / 1000).toFixed(1)}K%`;
  if (apy >= 100) return `${Math.round(apy)}%`;
  return formatPercentage(apy, 2);
}
