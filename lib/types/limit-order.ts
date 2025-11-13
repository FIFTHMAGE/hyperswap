/**
 * Limit order type definitions
 */

export interface LimitOrder {
  id: string;
  userAddress: string;
  inputToken: {
    address: string;
    symbol: string;
    amount: string;
    decimals: number;
  };
  outputToken: {
    address: string;
    symbol: string;
    minAmount: string;
    decimals: number;
  };
  limitPrice: number;
  currentPrice: number;
  expiryTime: number;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  createdAt: number;
  filledAt?: number;
  txHash?: string;
  chainId: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  side: 'buy' | 'sell';
}

