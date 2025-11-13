/**
 * API response wrapper types
 * @module types/api/response
 */

import type { PaginatedResponse } from '../common';

/**
 * Standard API response
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: APIMetadata;
}

/**
 * API error
 */
export interface APIError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

/**
 * API metadata
 */
export interface APIMetadata {
  requestId: string;
  timestamp: number;
  version: string;
  rateLimit?: RateLimitInfo;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Paginated API response
 */
export type PaginatedAPIResponse<T> = APIResponse<PaginatedResponse<T>>;

