/**
 * Gas price optimization utilities
 */

export interface GasEstimate {
  slow: { price: string; time: number };
  average: { price: string; time: number };
  fast: { price: string; time: number };
  timestamp: number;
}

export class GasOptimizer {
  static async fetchGasPrices(chainId: number): Promise<GasEstimate> {
    // Mock implementation - would call real gas oracle
    return {
      slow: { price: '20', time: 300 },
      average: { price: '35', time: 60 },
      fast: { price: '50', time: 15 },
      timestamp: Date.now(),
    };
  }

  static calculateOptimalGas(urgency: 'low' | 'medium' | 'high'): string {
    const multipliers = { low: 1, medium: 1.25, high: 1.5 };
    const baseGas = 30;
    return (baseGas * multipliers[urgency]).toFixed(0);
  }

  static estimateTxCost(gasPrice: string, gasLimit: string): string {
    return (parseFloat(gasPrice) * parseFloat(gasLimit) / 1e9).toFixed(6);
  }
}

