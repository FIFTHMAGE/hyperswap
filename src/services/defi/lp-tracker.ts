export interface LPPosition {
  protocol: string;
  pair: string;
  token0: string;
  token1: string;
  liquidity: number;
  value: number;
  fees24h: number;
  apr: number;
}

export interface ImpermanentLoss {
  current: number;
  percentage: number;
  vsHodl: number;
}

export class LPTracker {
  calculateImpermanentLoss(
    initialPrice0: number,
    initialPrice1: number,
    currentPrice0: number,
    currentPrice1: number,
    initialValue: number
  ): ImpermanentLoss {
    const priceRatio = (currentPrice1 / currentPrice0) / (initialPrice1 / initialPrice0);
    
    // Impermanent loss formula
    const ilMultiplier = 2 * Math.sqrt(priceRatio) / (1 + priceRatio);
    const currentLPValue = initialValue * ilMultiplier;
    
    // Value if held separately (HODL)
    const hodlValue = initialValue * (
      (0.5 * currentPrice0 / initialPrice0) +
      (0.5 * currentPrice1 / initialPrice1)
    );
    
    const impermanentLoss = hodlValue - currentLPValue;
    const ilPercentage = (impermanentLoss / hodlValue) * 100;

    return {
      current: currentLPValue,
      percentage: ilPercentage,
      vsHodl: impermanentLoss,
    };
  }

  calculateAPR(
    fees24h: number,
    totalLiquidity: number,
    userLiquidity: number
  ): number {
    if (totalLiquidity === 0) return 0;
    
    const userShare = userLiquidity / totalLiquidity;
    const dailyFees = fees24h * userShare;
    const yearlyFees = dailyFees * 365;
    
    return (yearlyFees / userLiquidity) * 100;
  }

  estimateFeesEarned(
    position: LPPosition,
    daysHeld: number
  ): number {
    const dailyFees = position.fees24h;
    return dailyFees * daysHeld;
  }

  async trackPosition(
    protocol: string,
    pairAddress: string,
    userAddress: string
  ): Promise<LPPosition | null> {
    // Placeholder implementation
    // In production, this would call protocol-specific APIs
    return null;
  }
}

export const lpTracker = new LPTracker();

