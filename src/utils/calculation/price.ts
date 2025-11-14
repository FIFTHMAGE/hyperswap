/**
 * Price calculation utilities
 * @module utils/calculation/price
 */

/**
 * Calculate price from reserves (Uniswap V2 formula)
 */
export function calculatePriceFromReserves(
  reserve0: string,
  reserve1: string,
  decimals0: number,
  decimals1: number
): number {
  const r0 = parseFloat(reserve0) / 10 ** decimals0;
  const r1 = parseFloat(reserve1) / 10 ** decimals1;
  
  if (r0 === 0) return 0;
  return r1 / r0;
}

/**
 * Calculate inverse price
 */
export function calculateInversePrice(price: number): number {
  if (price === 0) return 0;
  return 1 / price;
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(
  inputAmount: number,
  outputAmount: number,
  currentPrice: number
): number {
  if (inputAmount === 0 || currentPrice === 0) return 0;
  
  const executionPrice = outputAmount / inputAmount;
  const impact = ((executionPrice - currentPrice) / currentPrice) * 100;
  
  return impact;
}

/**
 * Calculate expected output amount
 */
export function calculateExpectedOutput(
  inputAmount: number,
  inputReserve: number,
  outputReserve: number,
  fee: number = 0.003 // 0.3% default fee
): number {
  const inputWithFee = inputAmount * (1 - fee);
  const numerator = inputWithFee * outputReserve;
  const denominator = inputReserve + inputWithFee;
  
  return numerator / denominator;
}

/**
 * Calculate minimum output with slippage
 */
export function calculateMinimumOutput(
  outputAmount: number,
  slippagePercent: number
): number {
  return outputAmount * (1 - slippagePercent / 100);
}

/**
 * Calculate maximum input with slippage
 */
export function calculateMaximumInput(
  inputAmount: number,
  slippagePercent: number
): number {
  return inputAmount * (1 + slippagePercent / 100);
}

/**
 * Calculate token value in USD
 */
export function calculateTokenValueUSD(
  amount: string,
  decimals: number,
  priceUSD: number
): number {
  const numericAmount = parseFloat(amount) / 10 ** decimals;
  return numericAmount * priceUSD;
}

/**
 * Calculate exchange rate
 */
export function calculateExchangeRate(
  amountIn: number,
  amountOut: number
): number {
  if (amountIn === 0) return 0;
  return amountOut / amountIn;
}

