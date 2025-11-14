/**
 * Blockchain address formatting utilities
 * @module utils/format/address
 */

/**
 * Truncate address for display (0x1234...5678)
 */
export function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Shorten address (0x1234...)
 */
export function shortenAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  if (address.length <= chars + 3) return address;
  
  return `${address.slice(0, chars)}...`;
}

/**
 * Format address with checksumming (basic)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return address.toLowerCase();
}

/**
 * Format transaction hash
 */
export function formatTxHash(hash: string, startChars: number = 10, endChars: number = 8): string {
  return truncateAddress(hash, startChars, endChars);
}

/**
 * Compare two addresses (case-insensitive)
 */
export function isSameAddress(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Format address for display with ENS support
 */
export function formatAddressOrENS(address: string, ensName?: string): string {
  if (ensName) return ensName;
  return truncateAddress(address);
}

/**
 * Mask address for privacy (0x****...****)
 */
export function maskAddress(address: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  
  return `${address.slice(0, 4)}****...****`;
}

