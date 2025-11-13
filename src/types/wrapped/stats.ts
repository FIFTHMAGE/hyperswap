/**
 * Year-wrapped statistics types
 * @module types/wrapped/stats
 */

import type { Address, ChainId } from '../blockchain';
import type { Token } from '../token';

/**
 * Wrapped statistics for a wallet
 */
export interface WrappedStats {
  address: Address;
  year: number;
  totalTransactions: number;
  totalVolumeUSD: number;
  totalGasSpentUSD: number;
  firstTransaction: {
    hash: string;
    timestamp: number;
    chain: ChainId;
  };
  mostActiveChain: {
    chainId: ChainId;
    transactions: number;
    percentage: number;
  };
  topTokens: Array<{
    token: Token;
    volumeUSD: number;
    transactionCount: number;
  }>;
  swapActivity: SwapActivityStats;
  nftActivity: NFTActivityStats;
  defiActivity: DeFiActivityStats;
  chainDistribution: Record<ChainId, number>;
  monthlyBreakdown: MonthlyStats[];
  achievements: Achievement[];
  comparison: UserComparison;
}

/**
 * Swap activity statistics
 */
export interface SwapActivityStats {
  totalSwaps: number;
  totalSwapVolumeUSD: number;
  averageSwapSizeUSD: number;
  largestSwap: {
    hash: string;
    valueUSD: number;
    tokens: { from: Token; to: Token };
  };
  favoriteTokenPair: {
    token0: Token;
    token1: Token;
    count: number;
  };
}

/**
 * NFT activity statistics
 */
export interface NFTActivityStats {
  totalNFTsMinted: number;
  totalNFTsBought: number;
  totalNFTsSold: number;
  totalNFTVolumeUSD: number;
  favoriteCollection: {
    name: string;
    address: Address;
    count: number;
  };
}

/**
 * DeFi activity statistics
 */
export interface DeFiActivityStats {
  totalLiquidityProvided: number;
  totalStaked: number;
  totalYieldEarnedUSD: number;
  protocols Used: string[];
  favoriteProtocol: {
    name: string;
    transactionCount: number;
  };
}

/**
 * Monthly statistics
 */
export interface MonthlyStats {
  month: number;
  transactions: number;
  volumeUSD: number;
  gasSpentUSD: number;
}

/**
 * Achievement/badge
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt: number;
}

/**
 * User comparison stats
 */
export interface UserComparison {
  rank: number;
  percentile: number;
  averageUser: {
    transactions: number;
    volumeUSD: number;
  };
}

