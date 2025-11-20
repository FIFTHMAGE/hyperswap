/**
 * Slippage Calculator - Calculate optimal slippage and price impacts
 * @module features/swap/utils
 */

export interface SlippageConfig {
  auto: boolean;
  percentage: number;
  maxSlippage: number;
  minSlippage: number;
}

export interface PriceImpact {
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  warning?: string;
}

export interface SlippageCalculation {
  recommendedSlippage: number;
  minOutputAmount: string;
  maxInputAmount: string;
  priceImpact: PriceImpact;
  executionPrice: string;
  invertedExecutionPrice: string;
}

const DEFAULT_SLIPPAGE = 0.5; // 0.5%
const MAX_SLIPPAGE = 50; // 50%
const MIN_SLIPPAGE = 0.01; // 0.01%

const PRICE_IMPACT_THRESHOLDS = {
  LOW: 1, // 1%
  MEDIUM: 3, // 3%
  HIGH: 5, // 5%
  CRITICAL: 10, // 10%
};

/**
 * Calculate recommended slippage based on liquidity and volatility
 */
export function calculateRecommendedSlippage(
  inputAmount: string,
  poolLiquidity: string,
  historicalVolatility: number
): number {
  const input = parseFloat(inputAmount);
  const liquidity = parseFloat(poolLiquidity);

  // Base slippage
  let slippage = DEFAULT_SLIPPAGE;

  // Adjust for liquidity ratio
  const liquidityRatio = input / liquidity;
  if (liquidityRatio > 0.1) {
    // Large trade relative to liquidity
    slippage += 2.0;
  } else if (liquidityRatio > 0.05) {
    slippage += 1.0;
  } else if (liquidityRatio > 0.01) {
    slippage += 0.5;
  }

  // Adjust for volatility
  slippage += historicalVolatility * 0.5;

  // Ensure within bounds
  return Math.max(MIN_SLIPPAGE, Math.min(MAX_SLIPPAGE, slippage));
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(
  inputAmount: string,
  outputAmount: string,
  marketPrice: string
): PriceImpact {
  const input = parseFloat(inputAmount);
  const output = parseFloat(outputAmount);
  const market = parseFloat(marketPrice);

  const executionPrice = input / output;
  const impactPercent = ((executionPrice - market) / market) * 100;

  let severity: PriceImpact['severity'] = 'low';
  let warning: string | undefined;

  if (impactPercent >= PRICE_IMPACT_THRESHOLDS.CRITICAL) {
    severity = 'critical';
    warning =
      'Price impact is extremely high. This trade will significantly affect the market price.';
  } else if (impactPercent >= PRICE_IMPACT_THRESHOLDS.HIGH) {
    severity = 'high';
    warning = 'Price impact is high. Consider splitting this trade into smaller amounts.';
  } else if (impactPercent >= PRICE_IMPACT_THRESHOLDS.MEDIUM) {
    severity = 'medium';
    warning = 'Price impact is moderate. You may receive less than expected.';
  } else if (impactPercent >= PRICE_IMPACT_THRESHOLDS.LOW) {
    severity = 'low';
  }

  return {
    percentage: impactPercent,
    severity,
    warning,
  };
}

/**
 * Calculate minimum output amount with slippage
 */
export function calculateMinOutput(outputAmount: string, slippage: number): string {
  const output = BigInt(outputAmount);
  const slippageBps = BigInt(Math.floor(slippage * 100));
  const minOutput = (output * (BigInt(10000) - slippageBps)) / BigInt(10000);
  return minOutput.toString();
}

/**
 * Calculate maximum input amount with slippage
 */
export function calculateMaxInput(inputAmount: string, slippage: number): string {
  const input = BigInt(inputAmount);
  const slippageBps = BigInt(Math.floor(slippage * 100));
  const maxInput = (input * (BigInt(10000) + slippageBps)) / BigInt(10000);
  return maxInput.toString();
}

/**
 * Calculate execution price
 */
export function calculateExecutionPrice(inputAmount: string, outputAmount: string): string {
  const input = parseFloat(inputAmount);
  const output = parseFloat(outputAmount);
  return (input / output).toFixed(6);
}

/**
 * Calculate inverted execution price
 */
export function calculateInvertedExecutionPrice(inputAmount: string, outputAmount: string): string {
  const input = parseFloat(inputAmount);
  const output = parseFloat(outputAmount);
  return (output / input).toFixed(6);
}

/**
 * Validate slippage tolerance
 */
export function validateSlippage(slippage: number): { valid: boolean; error?: string } {
  if (slippage < MIN_SLIPPAGE) {
    return {
      valid: false,
      error: `Slippage must be at least ${MIN_SLIPPAGE}%`,
    };
  }

  if (slippage > MAX_SLIPPAGE) {
    return {
      valid: false,
      error: `Slippage cannot exceed ${MAX_SLIPPAGE}%`,
    };
  }

  if (slippage > 5) {
    return {
      valid: true,
      error: 'High slippage tolerance may result in unfavorable execution',
    };
  }

  return { valid: true };
}

/**
 * Calculate complete slippage details
 */
export function calculateSlippage(
  inputAmount: string,
  outputAmount: string,
  slippagePercentage: number,
  marketPrice: string
): SlippageCalculation {
  const minOutput = calculateMinOutput(outputAmount, slippagePercentage);
  const maxInput = calculateMaxInput(inputAmount, slippagePercentage);
  const executionPrice = calculateExecutionPrice(inputAmount, outputAmount);
  const invertedPrice = calculateInvertedExecutionPrice(inputAmount, outputAmount);
  const priceImpact = calculatePriceImpact(inputAmount, outputAmount, marketPrice);

  return {
    recommendedSlippage: slippagePercentage,
    minOutputAmount: minOutput,
    maxInputAmount: maxInput,
    priceImpact,
    executionPrice,
    invertedExecutionPrice: invertedPrice,
  };
}

/**
 * Get slippage preset values
 */
export function getSlippagePresets(): number[] {
  return [0.1, 0.5, 1.0, 2.0, 5.0];
}

/**
 * Format slippage for display
 */
export function formatSlippage(slippage: number): string {
  return `${slippage.toFixed(2)}%`;
}

/**
 * Format price impact for display
 */
export function formatPriceImpact(impact: number): string {
  const sign = impact >= 0 ? '+' : '';
  return `${sign}${impact.toFixed(2)}%`;
}

/**
 * Check if slippage is too low
 */
export function isSlippageTooLow(
  slippage: number,
  volatility: number,
  liquidityRatio: number
): boolean {
  const minRecommended = DEFAULT_SLIPPAGE + volatility * 0.5;

  if (liquidityRatio > 0.05) {
    return slippage < minRecommended + 1.0;
  }

  return slippage < minRecommended;
}

/**
 * Calculate slippage from amounts
 */
export function calculateSlippageFromAmounts(expectedOutput: string, actualOutput: string): number {
  const expected = parseFloat(expectedOutput);
  const actual = parseFloat(actualOutput);
  return ((expected - actual) / expected) * 100;
}

/**
 * Get slippage warning
 */
export function getSlippageWarning(slippage: number): string | null {
  if (slippage < 0.1) {
    return 'Very low slippage may cause transaction to fail';
  }

  if (slippage > 10) {
    return 'Extremely high slippage - you may receive much less than expected';
  }

  if (slippage > 5) {
    return 'High slippage tolerance may result in unfavorable execution';
  }

  if (slippage > 2) {
    return 'Moderate slippage - transaction may execute at a less favorable price';
  }

  return null;
}
