/**
 * Liquidity feature types
 * @module features/liquidity/types
 */

export interface LiquidityPool {
  address: string;
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
}

export interface Position {
  id: string;
  poolAddress: string;
  liquidity: string;
  token0Amount: string;
  token1Amount: string;
}
