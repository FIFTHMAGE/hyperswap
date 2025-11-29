/**
 * Quote Types
 * Type definitions for swap quotes
 */

/**
 * Token info for quotes
 */
export interface QuoteToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

/**
 * Swap quote
 */
export interface SwapQuote {
  id: string;
  tokenIn: QuoteToken;
  tokenOut: QuoteToken;
  amountIn: string;
  amountInRaw: bigint;
  amountOut: string;
  amountOutRaw: bigint;
  amountOutMinimum: string;
  amountOutMinimumRaw: bigint;
  priceImpact: number;
  exchangeRate: number;
  inverseRate: number;
  route: QuoteRoute;
  gasCost: QuoteGasCost;
  fee: QuoteFee;
  protocol: string;
  validUntil: Date;
  timestamp: Date;
}

/**
 * Quote route
 */
export interface QuoteRoute {
  path: QuoteRouteHop[];
  routeString: string;
  percentage: number;
}

/**
 * Route hop
 */
export interface QuoteRouteHop {
  tokenIn: QuoteToken;
  tokenOut: QuoteToken;
  pool: string;
  fee: number;
  protocol: string;
}

/**
 * Gas cost estimate
 */
export interface QuoteGasCost {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedGas: string;
  estimatedGasUSD: string;
}

/**
 * Quote fee breakdown
 */
export interface QuoteFee {
  swapFee: number;
  swapFeeAmount: string;
  protocolFee: number;
  protocolFeeAmount: string;
  totalFee: number;
  totalFeeAmount: string;
  feeToken: QuoteToken;
}

/**
 * Quote request parameters
 */
export interface QuoteRequest {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  type: 'exactIn' | 'exactOut';
  slippageTolerance: number;
  recipient?: string;
  deadline?: number;
  protocols?: string[];
  maxHops?: number;
  excludePools?: string[];
}

/**
 * Quote comparison
 */
export interface QuoteComparison {
  quotes: SwapQuote[];
  bestQuote: SwapQuote;
  bestBy: 'output' | 'gas' | 'total';
  savings: {
    vsWorst: string;
    vsAverage: string;
  };
  timestamp: Date;
}

/**
 * Quote source
 */
export interface QuoteSource {
  id: string;
  name: string;
  logoURI?: string;
  isEnabled: boolean;
  priority: number;
  supportedChains: number[];
  supportsMultiHop: boolean;
  supportsExactOut: boolean;
}

/**
 * Quote aggregation result
 */
export interface AggregatedQuote {
  bestQuote: SwapQuote;
  allQuotes: QuoteBySource[];
  splits?: QuoteSplit[];
  aggregationType: 'single' | 'split';
  timestamp: Date;
}

/**
 * Quote by source
 */
export interface QuoteBySource {
  source: QuoteSource;
  quote: SwapQuote | null;
  error?: string;
  responseTime: number;
}

/**
 * Quote split for optimal routing
 */
export interface QuoteSplit {
  quote: SwapQuote;
  percentage: number;
  inputAmount: string;
  outputAmount: string;
}

/**
 * Quote update event
 */
export interface QuoteUpdateEvent {
  type: 'new' | 'update' | 'expired';
  quote: SwapQuote;
  previousQuote?: SwapQuote;
  priceChange?: number;
  timestamp: Date;
}

/**
 * Quote caching config
 */
export interface QuoteCacheConfig {
  maxAge: number;
  staleWhileRevalidate: boolean;
  cacheByAmount: boolean;
  refreshInterval: number;
}

/**
 * Quote error
 */
export interface QuoteError {
  code: QuoteErrorCode;
  message: string;
  source?: string;
  details?: Record<string, unknown>;
}

/**
 * Quote error codes
 */
export type QuoteErrorCode = 
  | 'INSUFFICIENT_LIQUIDITY'
  | 'INVALID_TOKEN'
  | 'UNSUPPORTED_PAIR'
  | 'AMOUNT_TOO_SMALL'
  | 'AMOUNT_TOO_LARGE'
  | 'PRICE_IMPACT_TOO_HIGH'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

/**
 * Quote metrics
 */
export interface QuoteMetrics {
  totalQuotes: number;
  successfulQuotes: number;
  failedQuotes: number;
  averageResponseTime: number;
  averagePriceImpact: number;
  mostUsedProtocol: string;
  volumeUSD: string;
}

