/**
 * formatters - Utility functions for formatting values
 * @module utils
 */

/**
 * Format number with commas
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency value
 */
export function formatCurrency(value: number | string, currency: string = 'USD'): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return `${getCurrencySymbol(currency)}0.00`;

  return num.toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format large numbers with abbreviations (K, M, B, T)
 */
export function formatCompactNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e12) {
    return sign + (absNum / 1e12).toFixed(2) + 'T';
  }
  if (absNum >= 1e9) {
    return sign + (absNum / 1e9).toFixed(2) + 'B';
  }
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(2) + 'M';
  }
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(2) + 'K';
  }

  return sign + absNum.toFixed(2);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0%';

  return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`;
}

/**
 * Format token amount
 */
export function formatTokenAmount(
  amount: string | number,
  _decimals: number = 18,
  displayDecimals: number = 4
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num) || num === 0) return '0';

  // For very small numbers, use exponential notation
  if (num < 0.000001) {
    return num.toExponential(2);
  }

  // For small numbers, show more decimals
  if (num < 1) {
    return num.toFixed(6);
  }

  return num.toFixed(displayDecimals);
}

/**
 * Format address (shorten with ellipsis)
 */
export function formatAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address || address.length < startLength + endLength) {
    return address;
  }

  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

/**
 * Format transaction hash
 */
export function formatTxHash(hash: string): string {
  return formatAddress(hash, 6, 4);
}

/**
 * Format time ago
 */
export function formatTimeAgo(timestamp: number | Date): string {
  const now = Date.now();
  const then = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Format date
 */
export function formatDate(timestamp: number | Date, includeTime: boolean = false): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('en-US', options);
}

/**
 * Format duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Format price change
 */
export function formatPriceChange(change: number): {
  formatted: string;
  isPositive: boolean;
  className: string;
} {
  const isPositive = change >= 0;
  const formatted = formatPercentage(change);

  return {
    formatted,
    isPositive,
    className: isPositive ? 'text-green-500' : 'text-red-500',
  };
}

/**
 * Parse formatted number back to number
 */
export function parseFormattedNumber(value: string): number {
  // Remove commas and spaces
  const cleaned = value.replace(/[,\s]/g, '');
  return parseFloat(cleaned);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    INR: '₹',
    BTC: '₿',
    ETH: 'Ξ',
  };

  return symbols[currency.toUpperCase()] || currency;
}

/**
 * Format APR/APY
 */
export function formatAPR(apr: number, isAPY: boolean = false): string {
  return `${apr.toFixed(2)}% ${isAPY ? 'APY' : 'APR'}`;
}

/**
 * Format gas price
 */
export function formatGasPrice(gwei: number): string {
  if (gwei < 1) {
    return `${(gwei * 1000).toFixed(0)} mGwei`;
  }
  if (gwei < 100) {
    return `${gwei.toFixed(1)} Gwei`;
  }
  return `${gwei.toFixed(0)} Gwei`;
}

/**
 * Format slippage
 */
export function formatSlippage(slippage: number): string {
  return `${slippage.toFixed(2)}%`;
}

/**
 * Pluralize word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${plural || singular + 's'}`;
}

/**
 * Format market cap
 */
export function formatMarketCap(value: number): string {
  return `$${formatCompactNumber(value)}`;
}

/**
 * Format volume
 */
export function formatVolume(value: number): string {
  return formatCompactNumber(value);
}

/**
 * Format liquidity
 */
export function formatLiquidity(value: number): string {
  return `$${formatCompactNumber(value)}`;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format balance with unit
 */
export function formatBalanceWithUnit(
  balance: string | number,
  unit: string,
  decimals: number = 4
): string {
  const formatted = formatTokenAmount(balance, 18, decimals);
  return `${formatted} ${unit}`;
}

/**
 * Format USD value
 */
export function formatUSD(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '$0.00';

  if (Math.abs(num) < 0.01 && num !== 0) {
    return `$${num.toExponential(2)}`;
  }

  return formatCurrency(num, 'USD');
}

/**
 * Format ratio
 */
export function formatRatio(numerator: number, denominator: number, decimals: number = 4): string {
  if (denominator === 0) return 'N/A';
  const ratio = numerator / denominator;
  return ratio.toFixed(decimals);
}

/**
 * Format price with appropriate decimals based on value
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0.00';

  if (price < 0.01) return `$${price.toExponential(2)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;

  return formatCurrency(price);
}
