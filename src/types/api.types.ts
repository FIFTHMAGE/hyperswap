/**
 * API-related type definitions with strict contracts
 * @module api.types
 */

/** HTTP methods supported by the API */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/** HTTP status codes */
export type HttpStatusCode =
  | 200
  | 201
  | 204 // Success
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429 // Client errors
  | 500
  | 502
  | 503
  | 504; // Server errors

/** API request lifecycle status */
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'cancelled';

/** Error severity levels */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Error categories for better handling */
export type ErrorCategory =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'rate_limit'
  | 'server'
  | 'unknown';

/**
 * Standard API response wrapper
 * @template T - The type of data being returned
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
  meta?: ApiMeta;
}

/**
 * Comprehensive error structure
 */
export interface ApiError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  statusCode?: HttpStatusCode;
  details?: Record<string, unknown>;
  stack?: string;
  retryable: boolean;
  retryAfter?: number;
}

/**
 * Response metadata for debugging and caching
 */
export interface ApiMeta {
  requestId: string;
  duration: number;
  cached: boolean;
  cacheExpiry?: number;
  rateLimit?: RateLimitInfo;
  apiVersion?: string;
}

/**
 * Rate limiting information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Paginated response with navigation
 * @template T - The type of items in the paginated results
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean | CacheOptions;
  signal?: AbortSignal;
  priority?: RequestPriority;
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  enabled: boolean;
  ttl?: number;
  key?: string;
  revalidate?: boolean;
}

/**
 * Request priority for queue management
 */
export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Retry strategy configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  retryableErrors: ErrorCategory[];
  retryableStatusCodes: HttpStatusCode[];
}

/**
 * API endpoint definition
 */
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  authenticated?: boolean;
  rateLimit?: number;
  timeout?: number;
  cache?: CacheOptions;
}

/**
 * Batch request configuration
 */
export interface BatchRequest {
  requests: Array<{
    id: string;
    endpoint: string;
    config?: Omit<ApiRequestConfig, 'method'>;
  }>;
  parallel?: boolean;
  stopOnError?: boolean;
}

/**
 * Batch response
 */
export interface BatchResponse<T = unknown> {
  responses: Array<{
    id: string;
    response: ApiResponse<T>;
  }>;
  errors: Array<{
    id: string;
    error: ApiError;
  }>;
}

/**
 * WebSocket message types
 */
export interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
  timestamp: number;
  id: string;
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retryConfig: RetryConfig;
  headers?: Record<string, string>;
  interceptors?: ApiInterceptors;
}

/**
 * Request/Response interceptors
 */
export interface ApiInterceptors {
  request?: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;
  response?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  error?: (error: ApiError) => ApiError | Promise<ApiError>;
}

/** Type guard for successful responses */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined;
}

/** Type guard for error responses */
export function isApiError<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { error: ApiError } {
  return !response.success && response.error !== undefined;
}
