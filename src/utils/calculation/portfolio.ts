/**
 * Portfolio calculation utilities
 * @module utils/calculation/portfolio
 */

/**
 * Calculate total portfolio value
 */
export function calculateTotalValue(tokens: Array<{ amount: number; priceUSD: number }>): number {
  return tokens.reduce((total, token) => total + token.amount * token.priceUSD, 0);
}

/**
 * Calculate portfolio allocation
 */
export function calculateAllocation(
  tokenValue: number,
  totalValue: number
): number {
  if (totalValue === 0) return 0;
  return (tokenValue / totalValue) * 100;
}

/**
 * Calculate portfolio change
 */
export function calculatePortfolioChange(
  currentValue: number,
  previousValue: number
): {
  absolute: number;
  percentage: number;
} {
  const absolute = currentValue - previousValue;
  const percentage = previousValue === 0 ? 0 : (absolute / previousValue) * 100;
  
  return { absolute, percentage };
}

/**
 * Calculate profit/loss
 */
export function calculatePnL(
  currentValue: number,
  investedValue: number
): {
  amount: number;
  percentage: number;
  isProfit: boolean;
} {
  const amount = currentValue - investedValue;
  const percentage = investedValue === 0 ? 0 : (amount / investedValue) * 100;
  
  return {
    amount,
    percentage,
    isProfit: amount >= 0,
  };
}

/**
 * Calculate weighted average price
 */
export function calculateAveragePrice(
  transactions: Array<{ amount: number; price: number }>
): number {
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  if (totalAmount === 0) return 0;
  
  const weightedSum = transactions.reduce(
    (sum, tx) => sum + tx.amount * tx.price,
    0
  );
  
  return weightedSum / totalAmount;
}

/**
 * Calculate portfolio diversity score
 */
export function calculateDiversityScore(
  allocations: number[]
): number {
  // Shannon entropy for diversity
  const entropy = allocations.reduce((sum, allocation) => {
    if (allocation === 0) return sum;
    const p = allocation / 100;
    return sum - p * Math.log2(p);
  }, 0);
  
  // Normalize to 0-100 scale
  const maxEntropy = Math.log2(allocations.length);
  return maxEntropy === 0 ? 0 : (entropy / maxEntropy) * 100;
}

/**
 * Calculate risk score
 */
export function calculateRiskScore(
  volatilities: number[]
): number {
  if (volatilities.length === 0) return 0;
  
  const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
  
  // Convert volatility to risk score (0-100)
  return Math.min(avgVolatility * 10, 100);
}

