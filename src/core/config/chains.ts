/**
 * Detailed chain configurations
 * @module config/chains
 */

import { CHAIN_IDS } from '@/constants/blockchain';
import type { ChainId } from '@/types/blockchain';

/**
 * Chain-specific configuration
 */
interface ChainConfig {
  enabled: boolean;
  priority: number;
  features: {
    swap: boolean;
    liquidity: boolean;
    nft: boolean;
  };
  gasSettings: {
    minGasPrice?: string;
    maxGasPrice?: string;
    gasLimit?: number;
  };
  tokens: {
    featured: string[];
    stablecoins: string[];
  };
}

/**
 * Chain configurations
 */
export const CHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  [CHAIN_IDS.ETHEREUM]: {
    enabled: true,
    priority: 1,
    features: {
      swap: true,
      liquidity: true,
      nft: true,
    },
    gasSettings: {
      minGasPrice: '1',
      maxGasPrice: '500',
      gasLimit: 200000,
    },
    tokens: {
      featured: [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      ],
      stablecoins: [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
      ],
    },
  },
  [CHAIN_IDS.POLYGON]: {
    enabled: true,
    priority: 2,
    features: {
      swap: true,
      liquidity: true,
      nft: true,
    },
    gasSettings: {
      minGasPrice: '30',
      maxGasPrice: '500',
      gasLimit: 200000,
    },
    tokens: {
      featured: [
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
      ],
      stablecoins: [
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
      ],
    },
  },
  [CHAIN_IDS.ARBITRUM]: {
    enabled: true,
    priority: 3,
    features: {
      swap: true,
      liquidity: true,
      nft: true,
    },
    gasSettings: {
      gasLimit: 200000,
    },
    tokens: {
      featured: [
        '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC
        '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
      ],
      stablecoins: [
        '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC
        '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
      ],
    },
  },
  [CHAIN_IDS.OPTIMISM]: {
    enabled: true,
    priority: 4,
    features: {
      swap: true,
      liquidity: true,
      nft: false,
    },
    gasSettings: {
      gasLimit: 200000,
    },
    tokens: {
      featured: [],
      stablecoins: [],
    },
  },
  [CHAIN_IDS.BASE]: {
    enabled: true,
    priority: 5,
    features: {
      swap: true,
      liquidity: true,
      nft: false,
    },
    gasSettings: {
      gasLimit: 200000,
    },
    tokens: {
      featured: [],
      stablecoins: [],
    },
  },
  [CHAIN_IDS.AVALANCHE]: {
    enabled: true,
    priority: 6,
    features: {
      swap: true,
      liquidity: true,
      nft: false,
    },
    gasSettings: {
      minGasPrice: '25',
      gasLimit: 200000,
    },
    tokens: {
      featured: [],
      stablecoins: [],
    },
  },
};

/**
 * Get chain configuration
 */
export function getChainConfig(chainId: ChainId): ChainConfig {
  return CHAIN_CONFIGS[chainId];
}

/**
 * Get enabled chains sorted by priority
 */
export function getEnabledChains(): ChainId[] {
  return (Object.entries(CHAIN_CONFIGS) as [string, ChainConfig][])
    .filter(([, config]) => config.enabled)
    .sort(([, a], [, b]) => a.priority - b.priority)
    .map(([chainId]) => Number(chainId) as ChainId);
}

/**
 * Check if feature is supported on chain
 */
export function isFeatureSupported(
  chainId: ChainId,
  feature: keyof ChainConfig['features']
): boolean {
  return CHAIN_CONFIGS[chainId]?.features[feature] ?? false;
}
