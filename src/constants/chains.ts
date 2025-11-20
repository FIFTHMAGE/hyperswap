/**
 * Chain Constants - Network configurations
 * @module constants
 */

export interface Chain {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers: {
    default: { name: string; url: string };
  };
  testnet?: boolean;
}

export const ETHEREUM: Chain = {
  id: 1,
  name: 'Ethereum',
  network: 'homestead',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://eth.llamarpc.com'] },
    public: { http: ['https://eth.llamarpc.com'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
};

export const POLYGON: Chain = {
  id: 137,
  name: 'Polygon',
  network: 'matic',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
    public: { http: ['https://polygon-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
  },
};

export const BSC: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed1.binance.org'] },
    public: { http: ['https://bsc-dataseed1.binance.org'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
};

export const ARBITRUM: Chain = {
  id: 42161,
  name: 'Arbitrum One',
  network: 'arbitrum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://arb1.arbitrum.io/rpc'] },
    public: { http: ['https://arb1.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  },
};

export const OPTIMISM: Chain = {
  id: 10,
  name: 'Optimism',
  network: 'optimism',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://mainnet.optimism.io'] },
    public: { http: ['https://mainnet.optimism.io'] },
  },
  blockExplorers: {
    default: { name: 'Optimistic Etherscan', url: 'https://optimistic.etherscan.io' },
  },
};

export const BASE: Chain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
};

export const AVALANCHE: Chain = {
  id: 43114,
  name: 'Avalanche C-Chain',
  network: 'avalanche',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
};

export const SUPPORTED_CHAINS: Chain[] = [
  ETHEREUM,
  POLYGON,
  BSC,
  ARBITRUM,
  OPTIMISM,
  BASE,
  AVALANCHE,
];

export const CHAIN_MAP: Record<number, Chain> = SUPPORTED_CHAINS.reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as Record<number, Chain>
);

export function getChainById(chainId: number): Chain | undefined {
  return CHAIN_MAP[chainId];
}

export function getChainName(chainId: number): string {
  return CHAIN_MAP[chainId]?.name || 'Unknown Chain';
}

export function getExplorerUrl(chainId: number, type: 'tx' | 'address', value: string): string {
  const chain = CHAIN_MAP[chainId];
  if (!chain) return '';

  const baseUrl = chain.blockExplorers.default.url;
  return `${baseUrl}/${type}/${value}`;
}
