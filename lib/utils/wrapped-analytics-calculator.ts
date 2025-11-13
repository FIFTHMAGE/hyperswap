/**
 * Analytics calculation utilities for wrapped
 */

export class WrappedAnalyticsCalculator {
  static calculateTradingStyle(stats: any): string {
    const { avgTransactionSize, frequency, volatility } = stats;

    if (avgTransactionSize < 100 && frequency < 10) {
      return 'Conservative';
    } else if (avgTransactionSize > 1000 || volatility > 50) {
      return 'Aggressive';
    } else if (avgTransactionSize > 10000) {
      return 'Degen';
    }
    return 'Balanced';
  }

  static calculatePercentile(userValue: number, allValues: number[]): number {
    const sorted = [...allValues].sort((a, b) => a - b);
    const index = sorted.findIndex((v) => v >= userValue);
    return (index / sorted.length) * 100;
  }

  static generateInsights(data: any): string[] {
    const insights: string[] = [];

    if (data.totalTransactions > 500) {
      insights.push('You\'re a power user! More active than 90% of traders.');
    }

    if (data.gasSpent > 1000) {
      insights.push('Consider using Layer 2 networks to save on gas fees.');
    }

    if (data.nftCount > 10) {
      insights.push('You\'re building quite the NFT collection!');
    }

    return insights;
  }

  static generatePredictions(historicalData: any): any[] {
    return [
      { title: 'Trade more on Layer 2', confidence: 85 },
      { title: 'Explore DeFi protocols', confidence: 70 },
      { title: 'Mint your first NFT', confidence: 60 },
    ];
  }

  static calculateROI(investments: any[], returns: any[]): number {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = returns.reduce((sum, ret) => sum + ret.amount, 0);
    return ((totalReturns - totalInvested) / totalInvested) * 100;
  }
}

