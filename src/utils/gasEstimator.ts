/**
 * gasEstimator - Gas price estimation and optimization utilities
 * @module utils
 */

export interface GasPrice {
  slow: string;
  standard: string;
  fast: string;
  instant: string;
}

export interface GasPriceInGwei {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: GasPriceInGwei;
  totalCost: {
    slow: string;
    standard: string;
    fast: string;
    instant: string;
  };
  totalCostUSD: {
    slow: number;
    standard: number;
    fast: number;
    instant: number;
  };
  estimatedTime: {
    slow: string;
    standard: string;
    fast: string;
    instant: string;
  };
}

export interface EIP1559GasPrice {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  baseFee: string;
}

export interface EIP1559Estimate {
  slow: EIP1559GasPrice;
  standard: EIP1559GasPrice;
  fast: EIP1559GasPrice;
  instant: EIP1559GasPrice;
}

/**
 * Fetch current gas prices from network
 */
export async function fetchGasPrices(): Promise<GasPriceInGwei> {
  try {
    // Mock implementation - would integrate with gas price oracle
    // In production: use Etherscan API, Gas Station Network, or similar
    return {
      slow: 20, // ~5 minutes
      standard: 30, // ~2 minutes
      fast: 50, // ~30 seconds
      instant: 100, // ~15 seconds
    };
  } catch (error) {
    console.error('Failed to fetch gas prices:', error);
    // Return fallback prices
    return {
      slow: 25,
      standard: 35,
      fast: 55,
      instant: 110,
    };
  }
}

/**
 * Fetch EIP-1559 gas prices
 */
export async function fetchEIP1559GasPrices(): Promise<EIP1559Estimate> {
  try {
    // Mock implementation
    const baseFee = 30; // Current base fee

    return {
      slow: {
        maxFeePerGas: (baseFee + 2).toString(),
        maxPriorityFeePerGas: '1',
        baseFee: baseFee.toString(),
      },
      standard: {
        maxFeePerGas: (baseFee + 3).toString(),
        maxPriorityFeePerGas: '1.5',
        baseFee: baseFee.toString(),
      },
      fast: {
        maxFeePerGas: (baseFee + 5).toString(),
        maxPriorityFeePerGas: '2',
        baseFee: baseFee.toString(),
      },
      instant: {
        maxFeePerGas: (baseFee + 10).toString(),
        maxPriorityFeePerGas: '3',
        baseFee: baseFee.toString(),
      },
    };
  } catch (error) {
    console.error('Failed to fetch EIP-1559 gas prices:', error);
    throw error;
  }
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  _from: string,
  _to: string,
  data: string,
  _value: string = '0'
): Promise<string> {
  try {
    // Mock implementation - would use provider.estimateGas()
    // Different operations have different gas costs
    if (data === '0x') {
      return '21000'; // Simple ETH transfer
    }

    // Token transfer (ERC20)
    if (data.startsWith('0xa9059cbb')) {
      return '65000';
    }

    // Swap operations
    if (data.includes('swap')) {
      return '150000';
    }

    // Default estimate
    return '100000';
  } catch (error) {
    console.error('Failed to estimate gas:', error);
    return '150000'; // Conservative fallback
  }
}

/**
 * Calculate total gas cost
 */
export function calculateGasCost(gasLimit: string, gasPrice: number): string {
  const limit = BigInt(gasLimit);
  const priceInWei = BigInt(Math.floor(gasPrice * 1e9)); // Convert Gwei to Wei
  const totalWei = limit * priceInWei;
  const totalEth = Number(totalWei) / 1e18;
  return totalEth.toFixed(6);
}

/**
 * Get full gas estimate with all speeds
 */
export async function getGasEstimate(
  from: string,
  to: string,
  data: string,
  value: string = '0',
  ethPriceUSD: number = 2000
): Promise<GasEstimate> {
  const [gasLimit, gasPrices] = await Promise.all([
    estimateGas(from, to, data, value),
    fetchGasPrices(),
  ]);

  const totalCost = {
    slow: calculateGasCost(gasLimit, gasPrices.slow),
    standard: calculateGasCost(gasLimit, gasPrices.standard),
    fast: calculateGasCost(gasLimit, gasPrices.fast),
    instant: calculateGasCost(gasLimit, gasPrices.instant),
  };

  const totalCostUSD = {
    slow: parseFloat(totalCost.slow) * ethPriceUSD,
    standard: parseFloat(totalCost.standard) * ethPriceUSD,
    fast: parseFloat(totalCost.fast) * ethPriceUSD,
    instant: parseFloat(totalCost.instant) * ethPriceUSD,
  };

  return {
    gasLimit,
    gasPrice: gasPrices,
    totalCost,
    totalCostUSD,
    estimatedTime: {
      slow: '~5 min',
      standard: '~2 min',
      fast: '~30 sec',
      instant: '~15 sec',
    },
  };
}

/**
 * Calculate optimal gas price based on urgency
 */
export async function getOptimalGasPrice(
  urgency: 'low' | 'medium' | 'high' = 'medium'
): Promise<number> {
  const prices = await fetchGasPrices();

  switch (urgency) {
    case 'low':
      return prices.slow;
    case 'medium':
      return prices.standard;
    case 'high':
      return prices.fast;
    default:
      return prices.standard;
  }
}

/**
 * Calculate gas price with multiplier
 */
export function applyGasMultiplier(gasPrice: number, multiplier: number): number {
  return Math.ceil(gasPrice * multiplier);
}

/**
 * Convert Gwei to Wei
 */
export function gweiToWei(gwei: number): string {
  return (gwei * 1e9).toString();
}

/**
 * Convert Wei to Gwei
 */
export function weiToGwei(wei: string): number {
  return Number(wei) / 1e9;
}

/**
 * Convert Wei to ETH
 */
export function weiToEth(wei: string): string {
  return (Number(wei) / 1e18).toFixed(6);
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gwei: number): string {
  if (gwei < 1) {
    return `${(gwei * 1000).toFixed(2)} mGwei`;
  }
  return `${gwei.toFixed(2)} Gwei`;
}

/**
 * Predict transaction time
 */
export function predictTransactionTime(gasPrice: number): string {
  const prices = {
    slow: 20,
    standard: 30,
    fast: 50,
    instant: 100,
  };

  if (gasPrice <= prices.slow) return '5-10 minutes';
  if (gasPrice <= prices.standard) return '2-5 minutes';
  if (gasPrice <= prices.fast) return '30-120 seconds';
  return '< 30 seconds';
}

/**
 * Check if gas price is reasonable
 */
export async function isGasPriceReasonable(gasPrice: number): Promise<{
  reasonable: boolean;
  message: string;
  suggestion?: number;
}> {
  const currentPrices = await fetchGasPrices();

  if (gasPrice > currentPrices.instant * 2) {
    return {
      reasonable: false,
      message: 'Gas price is extremely high. You may be overpaying.',
      suggestion: currentPrices.fast,
    };
  }

  if (gasPrice < currentPrices.slow * 0.5) {
    return {
      reasonable: false,
      message: 'Gas price is very low. Transaction may not be included.',
      suggestion: currentPrices.slow,
    };
  }

  return {
    reasonable: true,
    message: 'Gas price is within reasonable range.',
  };
}

/**
 * Calculate savings from gas optimization
 */
export function calculateGasSavings(
  originalGasLimit: string,
  optimizedGasLimit: string,
  gasPrice: number,
  ethPriceUSD: number = 2000
): {
  savedGas: string;
  savedETH: string;
  savedUSD: number;
  percentSaved: number;
} {
  const original = BigInt(originalGasLimit);
  const optimized = BigInt(optimizedGasLimit);
  const saved = original - optimized;

  const savedETH = calculateGasCost(saved.toString(), gasPrice);
  const savedUSD = parseFloat(savedETH) * ethPriceUSD;
  const percentSaved = (Number(saved) / Number(original)) * 100;

  return {
    savedGas: saved.toString(),
    savedETH,
    savedUSD,
    percentSaved,
  };
}

/**
 * Get gas trends
 */
export async function getGasTrends(): Promise<{
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: string;
}> {
  // Mock implementation - would analyze historical gas prices
  const trends = ['increasing', 'decreasing', 'stable'] as const;
  const trend = trends[Math.floor(Math.random() * trends.length)];

  const recommendations = {
    increasing: 'Gas prices are rising. Consider waiting or using higher gas price.',
    decreasing: 'Gas prices are falling. Good time to execute transactions.',
    stable: 'Gas prices are stable. Normal execution recommended.',
  };

  return {
    trend,
    recommendation: recommendations[trend],
  };
}

/**
 * Estimate batch transaction gas
 */
export function estimateBatchGas(
  singleTxGas: string,
  txCount: number,
  batchOverhead: number = 21000
): string {
  const single = BigInt(singleTxGas);
  const count = BigInt(txCount);
  const overhead = BigInt(batchOverhead);

  // Batch transactions typically save ~20% gas per additional transaction
  const discount = BigInt(80); // 80% of original cost per tx after first
  const firstTx = single;
  const additionalTxs = (single * discount * (count - BigInt(1))) / BigInt(100);

  return (firstTx + additionalTxs + overhead).toString();
}
