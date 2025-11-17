/**
 * Supported blockchain chains configuration
 */

export interface ChainConfig {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorer: string;
  enabled: boolean;
}

export const supportedChains: Record<number, ChainConfig> = {
  1: {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorer: 'https://etherscan.io',
    enabled: true,
  },
  137: {
    id: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorer: 'https://polygonscan.com',
    enabled: true,
  },
  56: {
    id: 56,
    name: 'BNB Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorer: 'https://bscscan.com',
    enabled: true,
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorer: 'https://arbiscan.io',
    enabled: true,
  },
  10: {
    id: 10,
    name: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorer: 'https://optimistic.etherscan.io',
    enabled: true,
  },
  8453: {
    id: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorer: 'https://basescan.org',
    enabled: true,
  },
};

export function getChainById(chainId: number): ChainConfig | undefined {
  return supportedChains[chainId];
}

export function getEnabledChains(): ChainConfig[] {
  return Object.values(supportedChains).filter((chain) => chain.enabled);
}
