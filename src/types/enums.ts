/**
 * Type enumerations
 * @module types/enums
 */

/**
 * Network environment
 */
export enum NetworkEnvironment {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Development = 'development',
}

/**
 * Transaction status enum
 */
export enum TransactionStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Replaced = 'replaced',
}

/**
 * Swap provider enum
 */
export enum SwapProvider {
  UniswapV2 = 'uniswap-v2',
  UniswapV3 = 'uniswap-v3',
  Sushiswap = 'sushiswap',
  Curve = 'curve',
  Balancer = 'balancer',
  OneInch = '1inch',
}

/**
 * Sort order enum
 */
export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

/**
 * Time range enum
 */
export enum TimeRange {
  Hour = '1h',
  Day = '24h',
  Week = '7d',
  Month = '30d',
  Year = '1y',
  All = 'all',
}

/**
 * Toast type enum
 */
export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

