/**
 * Service layer type definitions and contracts
 * @module service.types
 */

import type { ApiResponse, ApiRequestConfig } from './api.types';
import type { AppError } from './error.types';

// ============================================================================
// BASE SERVICE TYPES
// ============================================================================

/**
 * Base service configuration
 */
export interface BaseServiceConfig {
  name: string;
  version: string;
  enabled: boolean;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

/**
 * Service health status
 */
export type ServiceHealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

/**
 * Service health check result
 */
export interface ServiceHealth {
  status: ServiceHealthStatus;
  message?: string;
  timestamp: number;
  latency?: number;
  details?: Record<string, unknown>;
}

/**
 * Service metrics
 */
export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  averageLatency: number;
  successRate: number;
  lastRequestAt: number | null;
  uptime: number;
}

// ============================================================================
// API SERVICE TYPES
// ============================================================================

/**
 * API service contract
 */
export interface ApiService {
  get<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  health(): Promise<ServiceHealth>;
}

/**
 * API client options
 */
export interface ApiClientOptions {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  timeout: number;
  retries: number;
  retryDelay: number;
}

// ============================================================================
// CACHE SERVICE TYPES
// ============================================================================

/**
 * Cache service contract
 */
export interface CacheService<T = unknown> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(pattern?: string): Promise<string[]>;
  size(): Promise<number>;
}

/**
 * Cache strategy type
 */
export type CacheStrategy = 'lru' | 'lfu' | 'fifo' | 'ttl';

/**
 * Cache options
 */
export interface CacheOptions {
  ttl: number;
  maxSize: number;
  strategy: CacheStrategy;
  serialize?: boolean;
}

// ============================================================================
// STORAGE SERVICE TYPES
// ============================================================================

/**
 * Storage service contract
 */
export interface StorageService<T = unknown> {
  getItem(key: string): Promise<T | null>;
  setItem(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

/**
 * Storage type
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory';

// ============================================================================
// BLOCKCHAIN SERVICE TYPES
// ============================================================================

/**
 * Provider service contract
 */
export interface ProviderService {
  getBlockNumber(): Promise<number>;
  getBalance(address: string): Promise<string>;
  getTransaction(hash: string): Promise<unknown>;
  getTransactionReceipt(hash: string): Promise<unknown>;
  call(transaction: unknown): Promise<string>;
  estimateGas(transaction: unknown): Promise<string>;
  sendTransaction(transaction: unknown): Promise<string>;
}

/**
 * Wallet service contract
 */
export interface WalletService {
  connect(connector: string): Promise<{ address: string; chainId: number }>;
  disconnect(): Promise<void>;
  signMessage(message: string): Promise<string>;
  signTransaction(transaction: unknown): Promise<string>;
  switchChain(chainId: number): Promise<void>;
  addChain(chain: unknown): Promise<void>;
}

// ============================================================================
// TOKEN SERVICE TYPES
// ============================================================================

/**
 * Token price service contract
 */
export interface TokenPriceService {
  getPrice(tokenAddress: string, chainId: number): Promise<number>;
  getPrices(tokens: Array<{ address: string; chainId: number }>): Promise<Map<string, number>>;
  getPriceHistory(tokenAddress: string, chainId: number, timeframe: string): Promise<unknown[]>;
  subscribeToPrice(
    tokenAddress: string,
    chainId: number,
    callback: (price: number) => void
  ): () => void;
}

/**
 * Token metadata service contract
 */
export interface TokenMetadataService {
  getMetadata(tokenAddress: string, chainId: number): Promise<unknown>;
  searchTokens(query: string, chainId?: number): Promise<unknown[]>;
  getPopularTokens(chainId: number, limit?: number): Promise<unknown[]>;
}

// ============================================================================
// SWAP SERVICE TYPES
// ============================================================================

/**
 * Quote service contract
 */
export interface QuoteService {
  getQuote(params: QuoteParams): Promise<unknown>;
  refreshQuote(quoteId: string): Promise<unknown>;
  validateQuote(quoteId: string): Promise<boolean>;
}

/**
 * Quote request parameters
 */
export interface QuoteParams {
  fromToken: string;
  toToken: string;
  amount: string;
  chainId: number;
  slippage: number;
  userAddress?: string;
}

/**
 * Swap execution service contract
 */
export interface SwapExecutionService {
  executeSwap(quote: unknown): Promise<string>;
  approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<string>;
  checkAllowance(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string
  ): Promise<string>;
}

// ============================================================================
// ANALYTICS SERVICE TYPES
// ============================================================================

/**
 * Analytics service contract
 */
export interface AnalyticsService {
  track(event: string, properties?: Record<string, unknown>): Promise<void>;
  page(name: string, properties?: Record<string, unknown>): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  group(groupId: string, traits?: Record<string, unknown>): Promise<void>;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// ============================================================================
// NOTIFICATION SERVICE TYPES
// ============================================================================

/**
 * Notification service contract
 */
export interface NotificationService {
  show(notification: NotificationPayload): Promise<string>;
  hide(id: string): Promise<void>;
  hideAll(): Promise<void>;
  update(id: string, notification: Partial<NotificationPayload>): Promise<void>;
}

/**
 * Notification payload
 */
export interface NotificationPayload {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// WEBSOCKET SERVICE TYPES
// ============================================================================

/**
 * WebSocket service contract
 */
export interface WebSocketService {
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
  send(message: unknown): Promise<void>;
  subscribe(channel: string, callback: (data: unknown) => void): () => void;
  isConnected(): boolean;
}

/**
 * WebSocket message
 */
export interface WebSocketMessage {
  type: string;
  channel?: string;
  data: unknown;
  timestamp: number;
}

/**
 * WebSocket connection state
 */
export type WebSocketState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

// ============================================================================
// VALIDATION SERVICE TYPES
// ============================================================================

/**
 * Validation service contract
 */
export interface ValidationService {
  validate<T>(data: T, schema: unknown): Promise<ValidationResult<T>>;
  validateField(field: string, value: unknown, rules: unknown[]): Promise<FieldValidationResult>;
}

/**
 * Validation result
 */
export interface ValidationResult<T> {
  valid: boolean;
  data: T;
  errors: ValidationFieldError[];
}

/**
 * Field validation result
 */
export interface FieldValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validation field error
 */
export interface ValidationFieldError {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// EXPORT SERVICE TYPES
// ============================================================================

/**
 * Export service contract
 */
export interface ExportService {
  exportToCSV(data: unknown[], filename: string): Promise<void>;
  exportToJSON(data: unknown, filename: string): Promise<void>;
  exportToPDF(data: unknown, filename: string): Promise<void>;
}

/**
 * Export options
 */
export interface ExportOptions {
  filename: string;
  format: 'csv' | 'json' | 'pdf' | 'xlsx';
  headers?: string[];
  includeTimestamp?: boolean;
}

// ============================================================================
// LOGGER SERVICE TYPES
// ============================================================================

/**
 * Logger service contract
 */
export interface LoggerService {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error | AppError, context?: Record<string, unknown>): void;
}

/**
 * Log level
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
  error?: Error | AppError;
}

// ============================================================================
// SERVICE FACTORY TYPES
// ============================================================================

/**
 * Service factory
 */
export interface ServiceFactory<T> {
  create(config: BaseServiceConfig): T;
  getInstance(name: string): T | null;
  destroy(name: string): void;
}

/**
 * Service container
 */
export interface ServiceContainer {
  register<T>(name: string, service: T): void;
  get<T>(name: string): T;
  has(name: string): boolean;
  remove(name: string): void;
  clear(): void;
}

// ============================================================================
// SERVICE LIFECYCLE
// ============================================================================

/**
 * Service lifecycle hooks
 */
export interface ServiceLifecycle {
  onInit?(): Promise<void>;
  onDestroy?(): Promise<void>;
  onError?(error: AppError): Promise<void>;
}

/**
 * Service state
 */
export type ServiceState = 'uninitialized' | 'initializing' | 'ready' | 'error' | 'destroyed';
