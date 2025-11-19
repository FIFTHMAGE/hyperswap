export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

export interface PoolInfo {
  address: string;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: number;
}
