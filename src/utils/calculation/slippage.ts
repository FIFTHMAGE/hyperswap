/**
 * Slippage calculation utilities
 * @module utils/calculation/slippage
 */

/**
 * Calculate output with slippage
 */
export function applySlippage(
  amount: number,
  slippagePercent: number,
  direction: 'input' | 'output'
): number {
  const multiplier = direction === 'output'
    ? (1 - slippagePercent / 100)
    : (1 + slippagePercent / 100);
  
  return amount * multiplier;
}

/**
 * Calculate slippage amount
 */
export function calculateSlippageAmount(
  amount: number,
  slippagePercent: number
): number {
  return amount * (slippagePercent / 100);
}

/**
 * Calculate actual slippage from execution
 */
export function calculateActualSlippage(
  expected: number,
  actual: number
): number {
  if (expected === 0) return 0;
  return ((expected - actual) / expected) * 100;
}

/**
 * Check if slippage is within tolerance
 */
export function isSlippageWithinTolerance(
  expected: number,
  actual: number,
  tolerancePercent: number
): boolean {
  const actualSlippage = Math.abs(calculateActualSlippage(expected, actual));
  return actualSlippage <= tolerancePercent;
}

/**
 * Calculate recommended slippage based on liquidity
 */
export function recommendSlippage(
  tradeSize: number,
  liquidity: number
): number {
  const ratio = tradeSize / liquidity;
  
  if (ratio < 0.001) return 0.1; // 0.1% for tiny trades
  if (ratio < 0.01) return 0.5; // 0.5% for small trades
  if (ratio < 0.05) return 1.0; // 1% for medium trades
  if (ratio < 0.1) return 2.0; // 2% for large trades
  return 5.0; // 5% for very large trades
}

/**
 * Calculate slippage warning level
 */
export function getSlippageWarningLevel(slippage: number): {
  level: 'safe' | 'caution' | 'warning' | 'danger';
  message: string;
} {
  if (slippage < 0.5) {
    return { level: 'safe', message: 'Low slippage' };
  }
  if (slippage < 1) {
    return { level: 'safe', message: 'Normal slippage' };
  }
  if (slippage < 3) {
    return { level: 'caution', message: 'Moderate slippage' };
  }
  if (slippage < 5) {
    return { level: 'warning', message: 'High slippage' };
  }
  return { level: 'danger', message: 'Very high slippage - you may lose funds' };
}

