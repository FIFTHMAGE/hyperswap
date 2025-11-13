export interface YieldFarm {
  protocol: string;
  pool: string;
  stakedToken: string;
  rewardToken: string;
  stakedAmount: number;
  stakedValue: number;
  pendingRewards: number;
  apr: number;
  tvl: number;
}

export interface YieldStrategy {
  name: string;
  farms: YieldFarm[];
  totalValue: number;
  averageAPR: number;
  dailyRewards: number;
}

export class YieldFarmingAnalyzer {
  calculateRewards(
    stakedAmount: number,
    apr: number,
    daysStaked: number
  ): number {
    const dailyRate = apr / 365 / 100;
    return stakedAmount * dailyRate * daysStaked;
  }

  projectFutureValue(
    initialAmount: number,
    apr: number,
    days: number,
    compoundFrequency: number = 1 // 1 = daily, 7 = weekly
  ): number {
    const rate = apr / 100 / 365;
    const periods = days / compoundFrequency;
    const periodicRate = rate * compoundFrequency;
    
    return initialAmount * Math.pow(1 + periodicRate, periods);
  }

  compareStrategies(strategies: YieldStrategy[]): YieldStrategy[] {
    return strategies.sort((a, b) => {
      // Sort by risk-adjusted return (APR / number of protocols)
      const scoreA = a.averageAPR / a.farms.length;
      const scoreB = b.averageAPR / b.farms.length;
      return scoreB - scoreA;
    });
  }

  calculateRiskScore(farm: YieldFarm): number {
    let risk = 0;
    
    // TVL risk (lower TVL = higher risk)
    if (farm.tvl < 1000000) risk += 30;
    else if (farm.tvl < 10000000) risk += 15;
    
    // APR risk (suspiciously high APR)
    if (farm.apr > 1000) risk += 40;
    else if (farm.apr > 500) risk += 25;
    else if (farm.apr > 200) risk += 15;
    
    // Protocol risk (would need protocol audit data)
    // Placeholder: add 10-30 based on protocol reputation
    
    return Math.min(100, risk);
  }

  async fetchActiveFarms(address: string): Promise<YieldFarm[]> {
    // Placeholder - would integrate with various DeFi protocols
    return [];
  }
}

export const yieldFarmingAnalyzer = new YieldFarmingAnalyzer();

