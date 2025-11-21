/**
 * Type definitions
 * @module types
 */

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  slippage: number;
  route: string[];
  gasEstimate: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  chainId: number;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  balance: string | null;
}

export interface PriceData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  timestamp: number;
}
