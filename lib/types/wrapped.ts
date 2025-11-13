/**
 * Enhanced wrapped analytics types
 */

export interface QuarterlyBreakdown {
  quarter: string;
  transactions: number;
  volume: number;
  gasSpent: number;
  topActivity: string;
}

export interface NFTAnalytics {
  totalNFTs: number;
  collections: {
    name: string;
    count: number;
    floorPrice: number;
  }[];
  totalValue: number;
  mostValuableNFT: {
    name: string;
    collection: string;
    value: number;
  };
}

export interface DeFiActivity {
  protocol: string;
  interactions: number;
  volume: number;
  category: 'lending' | 'dex' | 'staking' | 'yield' | 'other';
  profit: number;
}

export interface WhaleTransaction {
  hash: string;
  timestamp: number;
  value: number;
  from: string;
  to: string;
  type: 'sent' | 'received';
}

export interface TokenHolding {
  symbol: string;
  holdDuration: number;
  avgBuyPrice: number;
  currentPrice: number;
  profitLoss: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
