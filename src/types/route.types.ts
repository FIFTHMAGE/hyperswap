/**
 * Route Types
 * Type definitions for swap routing
 */

/**
 * Token in route
 */
export interface RouteToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

/**
 * Route hop - single swap in path
 */
export interface RouteHop {
  tokenIn: RouteToken;
  tokenOut: RouteToken;
  poolAddress: string;
  poolFee: number;
  protocol: string;
  version?: number;
  amountIn?: string;
  amountOut?: string;
  priceImpact?: number;
}

/**
 * Complete swap route
 */
export interface SwapRoute {
  id: string;
  hops: RouteHop[];
  inputToken: RouteToken;
  outputToken: RouteToken;
  inputAmount: string;
  outputAmount: string;
  outputAmountMin: string;
  priceImpact: number;
  estimatedGas: string;
  gasPrice?: string;
  gasCostUSD?: string;
  executionPrice: number;
  marketPrice: number;
  slippage: number;
  deadline?: number;
  routeType: RouteType;
}

/**
 * Route type
 */
export type RouteType = 
  | 'direct'      // Single hop
  | 'multi_hop'   // Multiple hops through intermediaries
  | 'split'       // Split across multiple routes
  | 'aggregated'; // Aggregated from multiple DEXs

/**
 * Split route - for splitting across paths
 */
export interface SplitRoute {
  routes: SwapRoute[];
  splits: number[];
  totalInputAmount: string;
  totalOutputAmount: string;
  totalPriceImpact: number;
  totalGasCost: string;
  bestSingleRouteOutput: string;
  improvement: number;
}

/**
 * Route finding parameters
 */
export interface RouteParams {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  type: 'exactIn' | 'exactOut';
  slippageTolerance: number;
  recipient?: string;
  deadline?: number;
  maxHops?: number;
  maxSplits?: number;
  protocols?: string[];
  excludePools?: string[];
  preferProtocols?: string[];
}

/**
 * Route finding result
 */
export interface RouteResult {
  bestRoute: SwapRoute | null;
  splitRoute: SplitRoute | null;
  allRoutes: SwapRoute[];
  useSplit: boolean;
  timestamp: Date;
  validUntil: Date;
}

/**
 * Pool for routing
 */
export interface RoutingPool {
  address: string;
  token0: RouteToken;
  token1: RouteToken;
  reserve0: string;
  reserve1: string;
  fee: number;
  protocol: string;
  tvlUSD?: number;
  volume24hUSD?: number;
  isStable?: boolean;
}

/**
 * Route graph node
 */
export interface RouteNode {
  token: RouteToken;
  edges: RouteEdge[];
}

/**
 * Route graph edge
 */
export interface RouteEdge {
  pool: RoutingPool;
  tokenOut: RouteToken;
  liquidity: string;
  fee: number;
}

/**
 * Route optimization settings
 */
export interface RouteOptimizationConfig {
  maxHops: number;
  maxSplits: number;
  minLiquidity: string;
  maxPriceImpact: number;
  gasPrice: string;
  preferLowerGas: boolean;
  preferLowerImpact: boolean;
  protocols: ProtocolConfig[];
}

/**
 * Protocol configuration
 */
export interface ProtocolConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  gasOverhead: number;
  supportedChains: number[];
}

/**
 * Route comparison
 */
export interface RouteComparison {
  route: SwapRoute;
  outputAmount: string;
  outputDifference: string;
  outputDifferencePercent: number;
  gasCost: string;
  gasDifference: string;
  netOutput: string;
  netDifference: string;
  rank: number;
}

/**
 * Route cache entry
 */
export interface RouteCacheEntry {
  key: string;
  route: SwapRoute;
  timestamp: number;
  ttl: number;
  hitCount: number;
}

/**
 * Route execution params
 */
export interface RouteExecutionParams {
  route: SwapRoute;
  recipient: string;
  deadline: number;
  permitSignature?: string;
  referrer?: string;
}

/**
 * Route execution result
 */
export interface RouteExecutionResult {
  success: boolean;
  transactionHash?: string;
  inputAmount: string;
  outputAmount: string;
  actualPriceImpact: number;
  gasUsed: string;
  error?: string;
}

/**
 * Route analytics
 */
export interface RouteAnalytics {
  totalRoutes: number;
  avgHops: number;
  avgPriceImpact: number;
  avgGasCost: string;
  protocolDistribution: Record<string, number>;
  splitUsagePercent: number;
  successRate: number;
}

