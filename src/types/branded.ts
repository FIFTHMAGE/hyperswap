/**
 * Branded types for type safety
 * @module types/branded
 */

/**
 * Brand symbol
 */
declare const brand: unique symbol;

/**
 * Brand a type with a unique marker
 */
export type Brand<T, B> = T & { [brand]: B };

/**
 * Branded address type for enhanced type safety
 */
export type BrandedAddress = Brand<string, 'Address'>;

/**
 * Branded transaction hash
 */
export type BrandedTxHash = Brand<string, 'TxHash'>;

/**
 * Branded chain ID
 */
export type BrandedChainId = Brand<number, 'ChainId'>;

/**
 * Branded token ID
 */
export type BrandedTokenId = Brand<string, 'TokenId'>;

/**
 * Branded pool ID
 */
export type BrandedPoolId = Brand<string, 'PoolId'>;

/**
 * Branded user ID
 */
export type BrandedUserId = Brand<string, 'UserId'>;

/**
 * Branded session ID
 */
export type BrandedSessionId = Brand<string, 'SessionId'>;

/**
 * Branded request ID
 */
export type BrandedRequestId = Brand<string, 'RequestId'>;

/**
 * Create a branded address
 */
export function createBrandedAddress(address: string): BrandedAddress {
  return address as BrandedAddress;
}

/**
 * Create a branded transaction hash
 */
export function createBrandedTxHash(hash: string): BrandedTxHash {
  return hash as BrandedTxHash;
}

/**
 * Create a branded chain ID
 */
export function createBrandedChainId(chainId: number): BrandedChainId {
  return chainId as BrandedChainId;
}

/**
 * Extract the underlying value from a branded type
 */
export function unbrand<T>(value: Brand<T, any>): T {
  return value as T;
}

