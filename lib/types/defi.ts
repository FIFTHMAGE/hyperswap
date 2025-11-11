export interface DeFiProtocol {
  name: string;
  logo: string;
  chainId: number;
  interactionCount: number;
  totalValue: number;
}

export interface SwapActivity {
  txHash: string;
  blockSignedAt: string;
  dexName: string;
  tokenIn: {
    symbol: string;
    amount: string;
  };
  tokenOut: {
    symbol: string;
    amount: string;
  };
  chainId: number;
}

export interface LiquidityPosition {
  protocol: string;
  poolAddress: string;
  token0: string;
  token1: string;
  liquidity: string;
  chainId: number;
}

