/**
 * Transaction preview and simulation
 */

export interface TxSimulation {
  success: boolean;
  gasUsed: string;
  changes: {
    tokenAddress: string;
    balanceChange: string;
  }[];
  warnings: string[];
}

export class TxSimulator {
  static async simulate(txData: any): Promise<TxSimulation> {
    return {
      success: true,
      gasUsed: '150000',
      changes: [],
      warnings: [],
    };
  }
}

