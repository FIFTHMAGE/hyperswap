/**
 * Transaction history type definitions
 */

export interface SwapHistoryItem {
  id: string;
  hash: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  inputToken: {
    symbol: string;
    address: string;
    amount: string;
    decimals: number;
    logoURI?: string;
  };
  outputToken: {
    symbol: string;
    address: string;
    amount: string;
    decimals: number;
    logoURI?: string;
  };
  inputValueUSD?: number;
  outputValueUSD?: number;
  gasUsed?: string;
  gasPrice?: string;
  gasCostUSD?: number;
  provider: string;
  chainId: number;
}

export interface SwapAnalytics {
  totalSwaps: number;
  totalVolumeUSD: number;
  totalGasCostUSD: number;
  averageGasCost: number;
  successRate: number;
  mostTradedToken: {
    symbol: string;
    address: string;
    count: number;
  };
  favoriteProvider: {
    name: string;
    count: number;
  };
  profitLoss: number;
  tradingActivity: {
    date: string;
    count: number;
    volume: number;
  }[];
}

export interface HistoryFilters {
  status?: 'pending' | 'success' | 'failed';
  tokens?: string[];
  providers?: string[];
  dateFrom?: number;
  dateTo?: number;
  minAmount?: number;
  chainId?: number;
}

