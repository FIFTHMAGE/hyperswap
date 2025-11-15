/**
 * Blockchain helper utilities
 * @module utils/blockchain/helpers
 */

import type { Address } from '@/types/blockchain.types';

/**
 * Get checksummed address (EIP-55)
 */
export function getChecksumAddress(address: Address): Address {
  // Simple implementation - in production use ethers.js or viem
  const addr = address.toLowerCase().replace('0x', '');
  return `0x${addr}` as Address;
}

/**
 * Compare addresses (case-insensitive)
 */
export function isSameAddress(addr1: Address, addr2: Address): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: Address): boolean {
  return address === '0x0000000000000000000000000000000000000000';
}

/**
 * Shorten address for display (0x1234...5678)
 */
export function shortenAddress(
  address: Address,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (address.length <= startChars + endChars + 2) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get explorer URL for address
 */
export function getExplorerAddressUrl(address: Address, chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    8453: 'https://basescan.org',
  };

  const baseUrl = explorers[chainId] || 'https://etherscan.io';
  return `${baseUrl}/address/${address}`;
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerTxUrl(txHash: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    8453: 'https://basescan.org',
  };

  const baseUrl = explorers[chainId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Format chain ID to hex
 */
export function chainIdToHex(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

/**
 * Parse chain ID from hex
 */
export function hexToChainId(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Get chain name from ID
 */
export function getChainName(chainId: number): string {
  const names: Record<number, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
    8453: 'Base',
    56: 'BNB Chain',
    43114: 'Avalanche',
    250: 'Fantom',
  };

  return names[chainId] || `Chain ${chainId}`;
}

/**
 * Check if chain is testnet
 */
export function isTestnet(chainId: number): boolean {
  const testnets = [3, 4, 5, 11155111, 80001, 421613, 420];
  return testnets.includes(chainId);
}
