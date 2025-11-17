/**
 * Portfolio feature types
 */

export interface PortfolioAsset {
  symbol: string;
  balance: string;
  value: number;
  allocation: number;
}

export interface PortfolioStats {
  totalValue: number;
  change24h: number;
  assetCount: number;
}
