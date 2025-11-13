/**
 * DEX Aggregator types
 * @module types/swap/aggregator
 */

import type { Address } from '../blockchain';
import type { SwapQuote, SwapRoute } from './index';

/**
 * Supported DEX protocols
 */
export type DEXProtocol =
  | 'uniswap-v2'
  | 'uniswap-v3'
  | 'sushiswap'
  | 'curve'
  | 'balancer'
  | 'pancakeswap'
  | '1inch'
  | '0x'
  | 'paraswap';

/**
 * DEX configuration
 */
export interface DEXConfig {
  protocol: DEXProtocol;
  router: Address;
  factory: Address;
  enabled: boolean;
  fee: number;
  supportedChains: number[];
}

/**
 * Aggregator quote request
 */
export interface AggregatorQuoteRequest {
  fromToken: Address;
  toToken: Address;
  amount: string;
  from Address: Address;
  slippage: number;
  protocols?: DEXProtocol[];
  gasPrice?: string;
}

/**
 * Aggregator quote response
 */
export interface AggregatorQuoteResponse {
  quotes: SwapQuote[];
  bestQuote: SwapQuote;
  savings: number;
  savingsUSD: number;
}

/**
 * Route optimization strategy
 */
export type RouteStrategy = 'best_price' | 'lowest_gas' | 'fastest' | 'balanced';

/**
 * Route optimizer configuration
 */
export interface RouteOptimizerConfig {
  strategy: RouteStrategy;
  maxHops: number;
  maxSplits: number;
  excludeProtocols?: DEXProtocol[];
  includeProtocols?: DEXProtocol[];
}

/**
 * Split route for optimal execution
 */
export interface SplitRoute {
  routes: Array<{
    route: SwapRoute;
    percentage: number;
    outputAmount: string;
  }>;
  totalOutputAmount: string;
  aggregatedPriceImpact: number;
}

