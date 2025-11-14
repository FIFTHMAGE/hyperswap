/**
 * Blockchain constants including chain IDs, RPC URLs, and block explorers
 * @module constants/blockchain
 */

import type { ChainId } from '@/types/blockchain';

/**
 * Supported chain IDs
 */
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BASE: 8453,
  AVALANCHE: 43114,
} as const;

/**
 * Chain information
 */
export const CHAINS: Record<ChainId, {
  id: ChainId;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrl: string;
}> = {
  [CHAIN_IDS.ETHEREUM]: {
    id: 1,
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth',
      'https://ethereum.publicnode.com',
    ],
    blockExplorerUrls: ['https://etherscan.io'],
    iconUrl: '/chains/ethereum.svg',
  },
  [CHAIN_IDS.POLYGON]: {
    id: 137,
    name: 'Polygon Mainnet',
    shortName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://polygon.llamarpc.com',
      'https://rpc.ankr.com/polygon',
      'https://polygon.rpc.blxrbdn.com',
    ],
    blockExplorerUrls: ['https://polygonscan.com'],
    iconUrl: '/chains/polygon.svg',
  },
  [CHAIN_IDS.ARBITRUM]: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://arb1.arbitrum.io/rpc',
      'https://rpc.ankr.com/arbitrum',
      'https://arbitrum.llamarpc.com',
    ],
    blockExplorerUrls: ['https://arbiscan.io'],
    iconUrl: '/chains/arbitrum.svg',
  },
  [CHAIN_IDS.OPTIMISM]: {
    id: 10,
    name: 'Optimism Mainnet',
    shortName: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://mainnet.optimism.io',
      'https://rpc.ankr.com/optimism',
      'https://optimism.llamarpc.com',
    ],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    iconUrl: '/chains/optimism.svg',
  },
  [CHAIN_IDS.BASE]: {
    id: 8453,
    name: 'Base Mainnet',
    shortName: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://mainnet.base.org',
      'https://base.llamarpc.com',
      'https://base.blockpi.network/v1/rpc/public',
    ],
    blockExplorerUrls: ['https://basescan.org'],
    iconUrl: '/chains/base.svg',
  },
  [CHAIN_IDS.AVALANCHE]: {
    id: 43114,
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://rpc.ankr.com/avalanche',
      'https://avalanche.public-rpc.com',
    ],
    blockExplorerUrls: ['https://snowtrace.io'],
    iconUrl: '/chains/avalanche.svg',
  },
};

/**
 * Default chain ID
 */
export const DEFAULT_CHAIN_ID: ChainId = CHAIN_IDS.ETHEREUM;

/**
 * Get chain by ID
 */
export function getChain(chainId: ChainId) {
  return CHAINS[chainId];
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): ChainId[] {
  return Object.keys(CHAINS).map(Number) as ChainId[];
}

/**
 * Check if chain is supported
 */
export function isChainSupported(chainId: number): chainId is ChainId {
  return chainId in CHAINS;
}

