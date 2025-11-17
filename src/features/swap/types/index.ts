/**
 * Swap feature types
 * @module features/swap/types
 */

export interface SwapToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

export interface SwapRoute {
  path: string[];
  pools: string[];
  expectedOutput: string;
  priceImpact: number;
  gasEstimate: string;
}

export interface SwapQuote {
  fromToken: SwapToken;
  toToken: SwapToken;
  amountIn: string;
  amountOut: string;
  routes: SwapRoute[];
  bestRoute: SwapRoute;
  slippage: number;
  deadline: number;
}

export interface SwapTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  nonce: number;
}

export interface SwapSettings {
  slippage: number;
  deadline: number;
  gasPrice: string;
  enableMEVProtection: boolean;
}
