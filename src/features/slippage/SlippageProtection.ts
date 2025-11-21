/**
 * Slippage Protection
 * Advanced slippage detection and protection mechanisms
 */

import { ethers } from 'ethers';

import logger from '../../utils/logger';

export interface SlippageConfig {
  maxSlippage: number; // percentage
  priceImpactWarning: number; // percentage
  priceImpactBlock: number; // percentage
  sandwichDetection: boolean;
  frontrunProtection: boolean;
}

export interface SlippageAnalysis {
  expectedAmount: string;
  minAmount: string;
  maxAmount: string;
  slippage: number;
  priceImpact: number;
  warning: boolean;
  blocked: boolean;
  reason?: string;
}

export interface PriceData {
  price: string;
  timestamp: number;
  blockNumber: number;
}

const DEFAULT_CONFIG: SlippageConfig = {
  maxSlippage: 0.5,
  priceImpactWarning: 1.0,
  priceImpactBlock: 5.0,
  sandwichDetection: true,
  frontrunProtection: true,
};

export class SlippageProtection {
  private config: SlippageConfig;
  private priceHistory: Map<string, PriceData[]> = new Map();
  private readonly HISTORY_SIZE = 100;

  constructor(config: Partial<SlippageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate slippage for a trade
   */
  calculateSlippage(inputAmount: string, expectedOutput: string, actualOutput: string): number {
    const expected = parseFloat(expectedOutput);
    const actual = parseFloat(actualOutput);

    if (expected === 0) return 0;

    return Math.abs(((expected - actual) / expected) * 100);
  }

  /**
   * Calculate price impact
   */
  calculatePriceImpact(
    tokenInAmount: string,
    tokenOutAmount: string,
    tokenInPrice: string,
    tokenOutPrice: string
  ): number {
    try {
      const amountIn = parseFloat(tokenInAmount);
      const amountOut = parseFloat(tokenOutAmount);
      const priceIn = parseFloat(tokenInPrice);
      const priceOut = parseFloat(tokenOutPrice);

      const valueIn = amountIn * priceIn;
      const valueOut = amountOut * priceOut;

      if (valueIn === 0) return 0;

      return Math.abs(((valueIn - valueOut) / valueIn) * 100);
    } catch (error) {
      logger.error('Error calculating price impact:', error);
      return 0;
    }
  }

  /**
   * Analyze trade for slippage risks
   */
  analyzeSlippage(
    inputAmount: string,
    expectedOutput: string,
    marketPrice: string,
    slippageTolerance: number
  ): SlippageAnalysis {
    const expectedBN = ethers.utils.parseEther(expectedOutput);
    const slippageMultiplier = ethers.BigNumber.from(10000 - Math.floor(slippageTolerance * 100));
    const minAmountBN = expectedBN.mul(slippageMultiplier).div(10000);

    const minAmount = ethers.utils.formatEther(minAmountBN);
    const maxAmount = ethers.utils.formatEther(
      expectedBN.mul(10000 + Math.floor(slippageTolerance * 100)).div(10000)
    );

    // Calculate price impact
    const priceImpact = this.calculatePriceImpact(
      inputAmount,
      expectedOutput,
      marketPrice,
      '1.0' // Assume 1:1 for simplification
    );

    let warning = false;
    let blocked = false;
    let reason: string | undefined;

    // Check price impact thresholds
    if (priceImpact >= this.config.priceImpactBlock) {
      blocked = true;
      reason = `Price impact too high (${priceImpact.toFixed(2)}%)`;
    } else if (priceImpact >= this.config.priceImpactWarning) {
      warning = true;
      reason = `High price impact (${priceImpact.toFixed(2)}%)`;
    }

    // Check slippage tolerance
    if (slippageTolerance > this.config.maxSlippage) {
      warning = true;
      reason = reason
        ? `${reason}; Slippage tolerance exceeds recommended maximum`
        : 'Slippage tolerance exceeds recommended maximum';
    }

    return {
      expectedAmount: expectedOutput,
      minAmount,
      maxAmount,
      slippage: slippageTolerance,
      priceImpact,
      warning,
      blocked,
      reason,
    };
  }

  /**
   * Record price data for analysis
   */
  recordPrice(pairId: string, price: string, blockNumber: number): void {
    const priceData: PriceData = {
      price,
      timestamp: Date.now(),
      blockNumber,
    };

    let history = this.priceHistory.get(pairId);
    if (!history) {
      history = [];
      this.priceHistory.set(pairId, history);
    }

    history.unshift(priceData);

    // Keep only recent history
    if (history.length > this.HISTORY_SIZE) {
      history.pop();
    }
  }

  /**
   * Detect potential sandwich attack
   */
  detectSandwichAttack(pairId: string, currentPrice: string): boolean {
    if (!this.config.sandwichDetection) return false;

    const history = this.priceHistory.get(pairId);
    if (!history || history.length < 3) return false;

    const current = parseFloat(currentPrice);
    const previous = parseFloat(history[0].price);
    const beforePrevious = parseFloat(history[1].price);

    // Check for sudden price spike followed by drop
    const spikeThreshold = 2.0; // 2% sudden change
    const recentChange = Math.abs(((current - previous) / previous) * 100);
    const previousChange = Math.abs(((previous - beforePrevious) / beforePrevious) * 100);

    return recentChange > spikeThreshold && previousChange > spikeThreshold;
  }

  /**
   * Get recommended slippage based on market conditions
   */
  getRecommendedSlippage(pairId: string, tradeSize: string, liquidityDepth: string): number {
    const history = this.priceHistory.get(pairId);

    // Calculate recent volatility
    let volatility = 0;
    if (history && history.length >= 10) {
      const prices = history.slice(0, 10).map((p) => parseFloat(p.price));
      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      const variance =
        prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
      volatility = Math.sqrt(variance) / avgPrice;
    }

    // Calculate trade size relative to liquidity
    const tradeSizeNum = parseFloat(tradeSize);
    const liquidityNum = parseFloat(liquidityDepth);
    const sizeRatio = tradeSizeNum / liquidityNum;

    // Base slippage
    let slippage = 0.5;

    // Adjust for volatility
    if (volatility > 0.02)
      slippage += 0.5; // High volatility
    else if (volatility > 0.01) slippage += 0.25; // Medium volatility

    // Adjust for trade size
    if (sizeRatio > 0.1)
      slippage += 1.0; // Large trade
    else if (sizeRatio > 0.05) slippage += 0.5; // Medium trade

    // Cap at configured maximum
    return Math.min(slippage, this.config.maxSlippage * 2);
  }

  /**
   * Validate slippage settings
   */
  validateSlippage(slippage: number): { valid: boolean; error?: string } {
    if (slippage < 0) {
      return { valid: false, error: 'Slippage cannot be negative' };
    }

    if (slippage > 50) {
      return { valid: false, error: 'Slippage cannot exceed 50%' };
    }

    if (slippage > this.config.maxSlippage * 2) {
      return {
        valid: false,
        error: `Slippage exceeds safe maximum (${this.config.maxSlippage * 2}%)`,
      };
    }

    return { valid: true };
  }

  /**
   * Calculate minimum amount with slippage
   */
  calculateMinimumAmount(expectedAmount: string, slippage: number): string {
    const expectedBN = ethers.utils.parseEther(expectedAmount);
    const slippageMultiplier = ethers.BigNumber.from(10000 - Math.floor(slippage * 100));
    const minAmountBN = expectedBN.mul(slippageMultiplier).div(10000);

    return ethers.utils.formatEther(minAmountBN);
  }

  /**
   * Check if price movement is suspicious
   */
  isSuspiciousPriceMovement(pairId: string, currentPrice: string): boolean {
    const history = this.priceHistory.get(pairId);
    if (!history || history.length < 5) return false;

    const current = parseFloat(currentPrice);
    const recentPrices = history.slice(0, 5).map((p) => parseFloat(p.price));
    const avgRecent = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;

    // Check for abnormal deviation
    const deviation = Math.abs(((current - avgRecent) / avgRecent) * 100);
    return deviation > 5.0; // 5% deviation threshold
  }

  /**
   * Get slippage statistics
   */
  getSlippageStats(pairId: string): {
    averageSlippage: number;
    maxSlippage: number;
    volatility: number;
  } {
    const history = this.priceHistory.get(pairId);
    if (!history || history.length < 2) {
      return { averageSlippage: 0, maxSlippage: 0, volatility: 0 };
    }

    const slippages: number[] = [];
    for (let i = 1; i < history.length; i++) {
      const current = parseFloat(history[i - 1].price);
      const previous = parseFloat(history[i].price);
      const slippage = Math.abs(((current - previous) / previous) * 100);
      slippages.push(slippage);
    }

    const averageSlippage = slippages.reduce((sum, s) => sum + s, 0) / slippages.length;
    const maxSlippage = Math.max(...slippages);

    const prices = history.map((p) => parseFloat(p.price));
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / avgPrice;

    return {
      averageSlippage,
      maxSlippage,
      volatility,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SlippageConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SlippageConfig {
    return { ...this.config };
  }

  /**
   * Clear price history
   */
  clearHistory(pairId?: string): void {
    if (pairId) {
      this.priceHistory.delete(pairId);
    } else {
      this.priceHistory.clear();
    }
  }
}

// Singleton instance
export const slippageProtection = new SlippageProtection();
