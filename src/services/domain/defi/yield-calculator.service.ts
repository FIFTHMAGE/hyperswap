/**
 * Yield calculation service
 * @module services/defi
 */

class YieldCalculatorService {
  calculateAPY(apr: number, compoundFrequency: number = 365): number {
    return Math.pow(1 + apr / compoundFrequency, compoundFrequency) - 1;
  }

  calculateAPR(apy: number, compoundFrequency: number = 365): number {
    return compoundFrequency * (Math.pow(1 + apy, 1 / compoundFrequency) - 1);
  }

  calculateImpermanentLoss(priceRatio: number): number {
    return (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
  }

  calculateLPValue(
    token0Amount: number,
    token1Amount: number,
    token0Price: number,
    token1Price: number
  ): number {
    return token0Amount * token0Price + token1Amount * token1Price;
  }
}

export const yieldCalculator = new YieldCalculatorService();
