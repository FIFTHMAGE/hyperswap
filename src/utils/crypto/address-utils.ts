/**
 * Crypto address utilities
 */

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!isValidEthereumAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function compareAddresses(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export function checksumAddress(address: string): string {
  // Simple implementation - in production use ethers.utils.getAddress
  return address.toLowerCase();
}

