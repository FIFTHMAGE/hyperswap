/**
 * Token constants and default token lists per chain
 * @module constants/tokens
 */

import type { Token } from '@/types/token';
import { CHAIN_IDS } from './blockchain';

/**
 * Popular tokens on Ethereum
 */
export const ETHEREUM_TOKENS: Token[] = [
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    chainId: CHAIN_IDS.ETHEREUM,
    decimals: 18,
    symbol: 'ETH',
    name: 'Ether',
    standard: 'Native',
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: CHAIN_IDS.ETHEREUM,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: CHAIN_IDS.ETHEREUM,
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chainId: CHAIN_IDS.ETHEREUM,
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chainId: CHAIN_IDS.ETHEREUM,
    decimals: 8,
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    chainId: CHAIN_IDS.ETHEREUM,
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
  },
];

/**
 * Popular tokens on Polygon
 */
export const POLYGON_TOKENS: Token[] = [
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    chainId: CHAIN_IDS.POLYGON,
    decimals: 18,
    symbol: 'MATIC',
    name: 'Polygon',
    standard: 'Native',
    logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  },
  {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    chainId: CHAIN_IDS.POLYGON,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
  {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    chainId: CHAIN_IDS.POLYGON,
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
  {
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    chainId: CHAIN_IDS.POLYGON,
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
  },
  {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    chainId: CHAIN_IDS.POLYGON,
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  },
];

/**
 * Popular tokens on Arbitrum
 */
export const ARBITRUM_TOKENS: Token[] = [
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    chainId: CHAIN_IDS.ARBITRUM,
    decimals: 18,
    symbol: 'ETH',
    name: 'Ether',
    standard: 'Native',
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    chainId: CHAIN_IDS.ARBITRUM,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
  {
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    chainId: CHAIN_IDS.ARBITRUM,
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
    standard: 'ERC20',
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
];

/**
 * Default token lists by chain
 */
export const DEFAULT_TOKEN_LISTS: Record<number, Token[]> = {
  [CHAIN_IDS.ETHEREUM]: ETHEREUM_TOKENS,
  [CHAIN_IDS.POLYGON]: POLYGON_TOKENS,
  [CHAIN_IDS.ARBITRUM]: ARBITRUM_TOKENS,
  [CHAIN_IDS.OPTIMISM]: [],
  [CHAIN_IDS.BASE]: [],
  [CHAIN_IDS.AVALANCHE]: [],
};

/**
 * Get default tokens for a chain
 */
export function getDefaultTokens(chainId: number): Token[] {
  return DEFAULT_TOKEN_LISTS[chainId] || [];
}

/**
 * Find token by address
 */
export function findToken(chainId: number, address: string): Token | undefined {
  const tokens = getDefaultTokens(chainId);
  return tokens.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
}

