/**
 * DEX protocol constants (router addresses, factory addresses, ABIs)
 * @module constants/dex
 */

import { CHAIN_IDS } from './blockchain';

/**
 * DEX Protocol identifiers
 */
export const DEX_PROTOCOLS = {
  UNISWAP_V2: 'uniswap-v2',
  UNISWAP_V3: 'uniswap-v3',
  SUSHISWAP: 'sushiswap',
  PANCAKESWAP: 'pancakeswap',
  CURVE: 'curve',
  BALANCER: 'balancer',
} as const;

/**
 * Uniswap V2 Router addresses
 */
export const UNISWAP_V2_ROUTER: Record<number, string> = {
  [CHAIN_IDS.ETHEREUM]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [CHAIN_IDS.POLYGON]: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', // QuickSwap
  [CHAIN_IDS.ARBITRUM]: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // SushiSwap
  [CHAIN_IDS.OPTIMISM]: '0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2',
  [CHAIN_IDS.BASE]: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
};

/**
 * Uniswap V2 Factory addresses
 */
export const UNISWAP_V2_FACTORY: Record<number, string> = {
  [CHAIN_IDS.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [CHAIN_IDS.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', // QuickSwap
  [CHAIN_IDS.ARBITRUM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4', // SushiSwap
};

/**
 * Uniswap V3 Router addresses
 */
export const UNISWAP_V3_ROUTER: Record<number, string> = {
  [CHAIN_IDS.ETHEREUM]: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [CHAIN_IDS.POLYGON]: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [CHAIN_IDS.ARBITRUM]: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [CHAIN_IDS.OPTIMISM]: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [CHAIN_IDS.BASE]: '0x2626664c2603336E57B271c5C0b26F421741e481',
};

/**
 * Uniswap V3 Factory addresses
 */
export const UNISWAP_V3_FACTORY: Record<number, string> = {
  [CHAIN_IDS.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [CHAIN_IDS.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [CHAIN_IDS.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [CHAIN_IDS.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [CHAIN_IDS.BASE]: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
};

/**
 * Simplified ERC20 ABI for common operations
 */
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const;

/**
 * Uniswap V2 Router ABI (essential methods)
 */
export const UNISWAP_V2_ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
] as const;

/**
 * Uniswap V3 Router ABI (essential methods)
 */
export const UNISWAP_V3_ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
  'function exactInput((bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)) external payable returns (uint256 amountOut)',
  'function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)',
  'function exactOutput((bytes path, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum)) external payable returns (uint256 amountIn)',
] as const;

/**
 * Common fee tiers for Uniswap V3
 */
export const UNISWAP_V3_FEE_TIERS = {
  LOWEST: 100, // 0.01%
  LOW: 500, // 0.05%
  MEDIUM: 3000, // 0.3%
  HIGH: 10000, // 1%
} as const;

/**
 * Get router address for a DEX protocol
 */
export function getRouterAddress(protocol: string, chainId: number): string | undefined {
  switch (protocol) {
    case DEX_PROTOCOLS.UNISWAP_V2:
      return UNISWAP_V2_ROUTER[chainId];
    case DEX_PROTOCOLS.UNISWAP_V3:
      return UNISWAP_V3_ROUTER[chainId];
    default:
      return undefined;
  }
}
