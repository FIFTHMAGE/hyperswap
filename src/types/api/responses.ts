export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface TokenResponse {
  symbol: string;
  address: string;
  decimals: number;
  price: number;
}

export interface PoolResponse {
  id: string;
  token0: string;
  token1: string;
  tvl: string;
  apy: number;
}
