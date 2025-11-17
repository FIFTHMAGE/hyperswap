/**
 * Token whitelist configuration
 * @module config/tokens
 */

import type { Token } from '@/types/blockchain.types';

export const COMMON_TOKENS: Record<number, Token[]> = {
  1: [
    // Ethereum
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      chainId: 1,
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      tags: ['wrapped'],
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: 1,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
      tags: ['stablecoin'],
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      chainId: 1,
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD',
      tags: ['stablecoin'],
    },
  ],
  137: [
    // Polygon
    {
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      chainId: 137,
      decimals: 18,
      symbol: 'WMATIC',
      name: 'Wrapped Matic',
      tags: ['wrapped'],
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      chainId: 137,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
      tags: ['stablecoin'],
    },
  ],
};

export const DEFAULT_TOKENS_PER_CHAIN = 20;
export const MAX_FAVORITE_TOKENS = 50;
