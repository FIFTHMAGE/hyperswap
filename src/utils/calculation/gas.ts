/**
 * Gas price calculation utilities
 * @module utils/calculation/gas
 */

import { GAS_LIMITS } from '@/constants/validation';

/**
 * Convert Wei to Gwei
 */
export function weiToGwei(wei: string | bigint): number {
  const value = typeof wei === 'string' ? BigInt(wei) : wei;
  return Number(value) / 1e9;
}

/**
 * Convert Gwei to Wei
 */
export function gweiToWei(gwei: number): bigint {
  return BigInt(Math.floor(gwei * 1e9));
}

/**
 * Calculate gas cost in native token
 */
export function calculateGasCost(gasLimit: number, gasPrice: number): number {
  return (gasLimit * gasPrice) / 1e9; // gasPrice in Gwei
}

/**
 * Calculate gas cost in USD
 */
export function calculateGasCostUSD(
  gasLimit: number,
  gasPriceGwei: number,
  nativeTokenPrice: number
): number {
  const gasCostInToken = calculateGasCost(gasLimit, gasPriceGwei);
  return gasCostInToken * nativeTokenPrice;
}

/**
 * Estimate gas with buffer
 */
export function estimateGasWithBuffer(estimatedGas: number, bufferPercent: number = 20): number {
  return Math.floor(estimatedGas * (1 + bufferPercent / 100));
}

/**
 * Calculate priority fee suggestion
 */
export function calculatePriorityFee(baseFeemaxFeePerGas: number, maxPriorityFee: number): {
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
} {
  return {
    maxFeePerGas: baseFeemaxFeePerGas + maxPriorityFee,
    maxPriorityFeePerGas: maxPriorityFee,
  };
}

/**
 * Compare gas prices
 */
export function compareGasPrices(price1: number, price2: number): {
  difference: number;
  percentDifference: number;
  cheaper: 'first' | 'second' | 'same';
} {
  const difference = price1 - price2;
  const percentDifference = ((difference / price2) * 100);
  
  let cheaper: 'first' | 'second' | 'same';
  if (Math.abs(difference) < 0.01) cheaper = 'same';
  else cheaper = difference < 0 ? 'first' : 'second';
  
  return { difference, percentDifference, cheaper };
}

