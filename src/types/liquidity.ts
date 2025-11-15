/**
 * Liquidity pool type definitions
 */

export interface LiquidityPool {
  id: string;
  address: string;
  token0: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    reserve: string;
  };
  token1: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    reserve: string;
  };
  tvl: number; // Total Value Locked in USD
  volume24h: number;
  volume7d: number;
  fees24h: number;
  apy: number;
  protocol: 'uniswap-v2' | 'uniswap-v3' | 'sushiswap' | 'curve' | 'balancer';
  chainId: number;
  fee: number; // Fee percentage
}

export interface PoolAnalytics {
  poolAddress: string;
  volumeHistory: {
    timestamp: number;
    volume: number;
  }[];
  liquidityHistory: {
    timestamp: number;
    liquidity: number;
  }[];
  priceHistory: {
    timestamp: number;
    token0Price: number;
    token1Price: number;
  }[];
  transactions: PoolTransaction[];
}

export interface PoolTransaction {
  hash: string;
  type: 'swap' | 'mint' | 'burn';
  timestamp: number;
  token0Amount: string;
  token1Amount: string;
  amountUSD: number;
  account: string;
}

export interface PoolPosition {
  poolAddress: string;
  userAddress: string;
  liquidity: string;
  token0Amount: string;
  token1Amount: string;
  shareOfPool: number; // percentage
  unclaimedFees0: string;
  unclaimedFees1: string;
  value: number; // USD value
}

export interface PoolFilters {
  minTVL?: number;
  minVolume24h?: number;
  minAPY?: number;
  protocols?: string[];
  tokens?: string[];
  sortBy?: 'tvl' | 'volume' | 'apy' | 'fees';
  sortDirection?: 'asc' | 'desc';
}

