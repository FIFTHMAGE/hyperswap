/**
 * Wrapped data generation utilities
 */

export class WrappedGenerator {
  static generateMockData(address: string) {
    return {
      intro: { year: 2024, username: address.slice(0, 8) },
      summary: { totalTx: 650, totalVolume: 290000, chainsUsed: 5, totalGas: 1250 },
      quarters: this.generateQuarters(),
      topTokens: this.generateTopTokens(),
      firstLast: this.generateFirstLast(),
      monthly: this.generateMonthly(),
      protocols: this.generateProtocols(),
      gasAnalysis: this.generateGasAnalysis(),
    };
  }

  private static generateQuarters() {
    return ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => ({
      quarter: q,
      transactions: 100 + Math.random() * 100,
      volume: 50000 + Math.random() * 50000,
      gasSpent: 200 + Math.random() * 200,
      topActivity: ['DEX Trading', 'NFT Minting', 'Lending', 'Staking'][Math.floor(Math.random() * 4)],
    }));
  }

  private static generateTopTokens() {
    return ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC'].map((symbol) => ({
      symbol,
      transactions: Math.floor(50 + Math.random() * 150),
      volume: Math.floor(10000 + Math.random() * 90000),
    }));
  }

  private static generateFirstLast() {
    return {
      firstTx: { date: 'Jan 1, 2024', token: 'ETH', amount: 0.5 },
      lastTx: { date: 'Dec 31, 2024', token: 'USDC', amount: 1000 },
    };
  }

  private static generateMonthly() {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      transactions: Math.floor(30 + Math.random() * 70),
    }));
  }

  private static generateProtocols() {
    return [
      { name: 'Uniswap', logo: '🦄', interactions: 150 },
      { name: 'Aave', logo: '👻', interactions: 80 },
      { name: 'Curve', logo: '🌊', interactions: 60 },
      { name: 'Compound', logo: '🏦', interactions: 45 },
      { name: 'Lido', logo: '🏝️', interactions: 30 },
      { name: 'MakerDAO', logo: '⚡', interactions: 25 },
    ];
  }

  private static generateGasAnalysis() {
    return {
      totalGas: 1250.50,
      avgGasPrice: 35,
      savedByOptimization: 150.25,
      mostExpensiveTx: {
        hash: '0x123...',
        gasPaid: 85.50,
        date: 'May 15, 2024',
      },
    };
  }
}

