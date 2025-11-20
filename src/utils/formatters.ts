/**
 * Formatters - Utility functions for formatting data
 * @module utils
 */

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: string | number, _decimals: number = 18): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (num === 0) return '0';
  if (num < 0.000001) return '< 0.000001';

  if (num < 1) {
    return num.toFixed(6);
  } else if (num < 1000) {
    return num.toFixed(4);
  } else if (num < 1000000) {
    return num.toFixed(2);
  } else {
    return formatCompactNumber(num);
  }
}

/**
 * Format number in compact notation (1.2K, 3.4M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toFixed(2);
  if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(2)}M`;
  return `${(num / 1000000000).toFixed(2)}B`;
}

/**
 * Format USD amount
 */
export function formatUSD(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.01) return '< $0.01';
  if (amount < 1000) return `$${amount.toFixed(2)}`;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format address (0x1234...5678)
 */
export function formatAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;

  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

/**
 * Format transaction hash
 */
export function formatTxHash(hash: string): string {
  return formatAddress(hash, 10, 8);
}

/**
 * Format timestamp
 */
export function formatTimestamp(
  timestamp: number | string | Date,
  format: 'relative' | 'absolute' = 'relative'
): string {
  const date =
    typeof timestamp === 'number' || typeof timestamp === 'string'
      ? new Date(timestamp)
      : timestamp;

  if (format === 'absolute') {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  // Relative time
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format gas price in Gwei
 */
export function formatGwei(wei: string | number): string {
  const gwei = typeof wei === 'string' ? parseFloat(wei) / 1e9 : wei / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}

/**
 * Format duration in seconds to human readable
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Parse token amount from string
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  try {
    const [whole = '0', fraction = '0'] = amount.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(whole + paddedFraction);
  } catch {
    return BigInt(0);
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
