/**
 * DEX configuration
 * @module config/dex
 */

export interface DexConfig {
  name: string;
  router: string;
  factory: string;
  enabled: boolean;
  fee: number; // basis points
}

export const DEX_CONFIGS: Record<number, Record<string, DexConfig>> = {
  1: {
    uniswapV2: {
      name: 'Uniswap V2',
      router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      enabled: true,
      fee: 30,
    },
    uniswapV3: {
      name: 'Uniswap V3',
      router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      enabled: true,
      fee: 30,
    },
    sushiswap: {
      name: 'SushiSwap',
      router: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
      factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
      enabled: true,
      fee: 30,
    },
  },
  137: {
    quickswap: {
      name: 'QuickSwap',
      router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
      factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
      enabled: true,
      fee: 30,
    },
  },
};

export const DEFAULT_SLIPPAGE = 0.5; // 0.5%
export const MAX_SLIPPAGE = 50; // 50%
export const DEFAULT_DEADLINE = 20; // 20 minutes
