/**
 * Swap-related type definitions
 */

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  balance?: string;
  price?: number;
}

export interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  minimumReceived: string;
  estimatedGas: string;
  route: SwapRoute[];
  provider: 'jupiter' | '1inch' | 'uniswap' | 'sushiswap';
}

export interface SwapRoute {
  protocol: string;
  tokenIn: string;
  tokenOut: string;
  percentage: number;
  poolAddress?: string;
}

export interface SwapSettings {
  slippage: number; // percentage
  deadline: number; // minutes
  autoRouting: boolean;
  expertMode: boolean;
  disableMultihops: boolean;
  gasPrice?: string;
}

export interface SwapTransaction {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount?: string;
  timestamp: number;
  gasUsed?: string;
  gasPrice?: string;
}

export const DEFAULT_SWAP_SETTINGS: SwapSettings = {
  slippage: 0.5,
  deadline: 20,
  autoRouting: true,
  expertMode: false,
  disableMultihops: false,
};

