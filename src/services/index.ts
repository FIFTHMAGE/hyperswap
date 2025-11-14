/**
 * Services barrel export
 * @module services
 */

// API services
export * from './api/client';
export * from './api/covalent.service';
export * from './api/token-price.service';

// Blockchain services
export * from './blockchain/provider.service';
export * from './blockchain/wallet.service';
export * from './blockchain/transaction.service';

// Cache services
export * from './cache/memory-cache.service';
export * from './cache/local-storage-cache.service';

// Error services
export * from './error/error-handler.service';
export * from './error/logger.service';

// Notification services
export * from './notification/toast.service';
export * from './notification/push.service';

// Real-time services
export * from './realtime/websocket.service';
export * from './realtime/subscription-manager.service';
export * from './realtime/price-feed.service';

// Security services
export * from './security/rate-limiter.service';
export * from './security/input-sanitizer.service';

// Storage services
export * from './storage/indexed-db.service';
export * from './storage/session.service';

// Validation services
export * from './validation/schema-validator.service';

// Analytics services
export * from './analytics/tracker.service';
export * from './analytics/performance.service';

// Export services
export * from './export/pdf.service';
export * from './export/csv.service';

// Swap services
export * from './swap/aggregator.service';
export * from './swap/quote.service';
export * from './swap/execution.service';
export * from './swap/history.service';
export * from './swap/route-optimizer.service';

// Liquidity services
export * from './liquidity/pool-discovery.service';
export * from './liquidity/pool-analytics.service';
export * from './liquidity/position-tracker.service';
export * from './liquidity/il-calculator.service';

// Portfolio services
export * from './portfolio/balance.service';
export * from './portfolio/valuation.service';
export * from './portfolio/transaction-history.service';
export * from './portfolio/pnl-calculator.service';

// Wrapped services
export * from './wrapped/data-aggregator.service';
export * from './wrapped/statistics.service';
export * from './wrapped/generator.service';
export * from './wrapped/share.service';

// Token services
export * from './token/metadata.service';
export * from './token/favorites.service';
