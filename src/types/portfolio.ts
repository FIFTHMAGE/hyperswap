/**
 * Portfolio tracking type definitions
 */

export interface PortfolioToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUSD: number;
  price: number;
  priceChange24h: number;
  logoURI?: string;
  chainId: number;
}

export interface PortfolioPosition {
  tokenAddress: string;
  tokenSymbol: string;
  averageBuyPrice: number;
  totalInvested: number;
  currentValue: number;
  quantity: number;
  profitLoss: number;
  profitLossPercent: number;
  firstPurchaseDate: number;
  lastTransactionDate: number;
}

export interface PortfolioStats {
  totalValueUSD: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  totalInvested: number;
  change24h: number;
  change24hPercent: number;
  bestPerformer: {
    symbol: string;
    profitLossPercent: number;
  } | null;
  worstPerformer: {
    symbol: string;
    profitLossPercent: number;
  } | null;
}

export interface PortfolioHistory {
  timestamp: number;
  totalValue: number;
  tokens: {
    symbol: string;
    value: number;
  }[];
}

export interface AssetAllocation {
  token: string;
  percentage: number;
  value: number;
  color: string;
}

