/**
 * Price Impact Utilities
 * Calculate and format price impact for swaps
 */

export interface PriceImpactResult {
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'very_high';
  warning?: string;
  formatted: string;
}

export interface ReserveData {
  reserve0: bigint;
  reserve1: bigint;
  decimals0: number;
  decimals1: number;
}

// Impact thresholds
const IMPACT_THRESHOLDS = {
  low: 1,      // < 1%
  medium: 3,   // 1-3%
  high: 5,     // 3-5%
  veryHigh: 10 // > 5%
};

/**
 * Calculate price impact for constant product AMM (x * y = k)
 */
export function calculatePriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  reserves: ReserveData,
  isToken0: boolean
): PriceImpactResult {
  const { reserve0, reserve1, decimals0, decimals1 } = reserves;

  // Current price (before swap)
  const price0 = Number(reserve1 * BigInt(10 ** decimals0)) / 
                 Number(reserve0 * BigInt(10 ** decimals1));
  
  // Amount in normalized
  const amountInNorm = Number(amountIn) / Math.pow(10, isToken0 ? decimals0 : decimals1);
  const amountOutNorm = Number(amountOut) / Math.pow(10, isToken0 ? decimals1 : decimals0);

  // Execution price
  const executionPrice = isToken0 
    ? amountOutNorm / amountInNorm 
    : amountInNorm / amountOutNorm;

  // Price impact
  const marketPrice = isToken0 ? price0 : 1 / price0;
  const impact = ((marketPrice - executionPrice) / marketPrice) * 100;

  return formatImpact(Math.abs(impact));
}

/**
 * Calculate price impact from reserves and amounts
 */
export function calculateImpactFromReserves(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  fee: number = 0.003
): PriceImpactResult {
  if (reserveIn === 0 || reserveOut === 0 || amountIn === 0) {
    return formatImpact(0);
  }

  // Amount after fee
  const amountInWithFee = amountIn * (1 - fee);

  // Expected output (without impact)
  const spotPrice = reserveOut / reserveIn;
  const expectedOutput = amountInWithFee * spotPrice;

  // Actual output using constant product formula
  const newReserveIn = reserveIn + amountInWithFee;
  const k = reserveIn * reserveOut;
  const newReserveOut = k / newReserveIn;
  const actualOutput = reserveOut - newReserveOut;

  // Price impact
  const impact = ((expectedOutput - actualOutput) / expectedOutput) * 100;

  return formatImpact(Math.max(0, impact));
}

/**
 * Calculate price impact for exact output
 */
export function calculateImpactExactOut(
  amountOut: number,
  reserveIn: number,
  reserveOut: number,
  fee: number = 0.003
): PriceImpactResult {
  if (reserveIn === 0 || reserveOut === 0 || amountOut === 0) {
    return formatImpact(0);
  }

  if (amountOut >= reserveOut) {
    return {
      percentage: 100,
      severity: 'very_high',
      warning: 'Trade size exceeds available liquidity',
      formatted: '>100%',
    };
  }

  // Calculate required input
  const newReserveOut = reserveOut - amountOut;
  const k = reserveIn * reserveOut;
  const newReserveIn = k / newReserveOut;
  const requiredIn = (newReserveIn - reserveIn) / (1 - fee);

  // Spot price based input
  const spotPrice = reserveIn / reserveOut;
  const expectedIn = amountOut * spotPrice / (1 - fee);

  // Price impact
  const impact = ((requiredIn - expectedIn) / expectedIn) * 100;

  return formatImpact(Math.max(0, impact));
}

/**
 * Format impact result
 */
function formatImpact(percentage: number): PriceImpactResult {
  let severity: PriceImpactResult['severity'];
  let warning: string | undefined;

  if (percentage < IMPACT_THRESHOLDS.low) {
    severity = 'low';
  } else if (percentage < IMPACT_THRESHOLDS.medium) {
    severity = 'medium';
  } else if (percentage < IMPACT_THRESHOLDS.high) {
    severity = 'high';
    warning = 'High price impact. Consider splitting your trade.';
  } else {
    severity = 'very_high';
    warning = 'Very high price impact! Your trade will move the market significantly.';
  }

  let formatted: string;
  if (percentage < 0.01) {
    formatted = '<0.01%';
  } else if (percentage > 99.99) {
    formatted = '>99.99%';
  } else {
    formatted = `${percentage.toFixed(2)}%`;
  }

  return { percentage, severity, warning, formatted };
}

/**
 * Get severity color class
 */
export function getImpactColor(severity: PriceImpactResult['severity']): string {
  switch (severity) {
    case 'low':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'high':
      return 'text-orange-500';
    case 'very_high':
      return 'text-red-500';
  }
}

/**
 * Get severity background class
 */
export function getImpactBgColor(severity: PriceImpactResult['severity']): string {
  switch (severity) {
    case 'low':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/30';
    case 'very_high':
      return 'bg-red-100 dark:bg-red-900/30';
  }
}

/**
 * Check if impact is acceptable
 */
export function isAcceptableImpact(
  impact: number,
  maxImpact: number = IMPACT_THRESHOLDS.high
): boolean {
  return impact <= maxImpact;
}

/**
 * Calculate optimal trade size to stay within impact threshold
 */
export function calculateOptimalSize(
  reserveIn: number,
  reserveOut: number,
  maxImpact: number = 1,
  fee: number = 0.003
): number {
  // Binary search for optimal size
  let low = 0;
  let high = reserveIn * 0.5; // Max 50% of reserves
  let optimal = 0;

  while (high - low > 0.0001) {
    const mid = (low + high) / 2;
    const impact = calculateImpactFromReserves(mid, reserveIn, reserveOut, fee);

    if (impact.percentage <= maxImpact) {
      optimal = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  return optimal;
}

/**
 * Split trade to minimize impact
 */
export function suggestSplits(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  maxImpactPerTrade: number = 1,
  fee: number = 0.003
): number[] {
  const fullImpact = calculateImpactFromReserves(amountIn, reserveIn, reserveOut, fee);
  
  if (fullImpact.percentage <= maxImpactPerTrade) {
    return [amountIn]; // No splitting needed
  }

  const optimalSize = calculateOptimalSize(reserveIn, reserveOut, maxImpactPerTrade, fee);
  
  if (optimalSize === 0) {
    return [amountIn]; // Can't optimize further
  }

  const numSplits = Math.ceil(amountIn / optimalSize);
  const splits: number[] = [];

  let remaining = amountIn;
  for (let i = 0; i < numSplits; i++) {
    const splitSize = Math.min(remaining, optimalSize);
    splits.push(splitSize);
    remaining -= splitSize;
  }

  return splits;
}

