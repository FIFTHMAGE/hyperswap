/**
 * Services barrel export - Layered Architecture
 * @module services
 *
 * Service Layer Organization:
 * - Domain: Business logic specific to application domains
 * - Infrastructure: External integrations and I/O operations
 * - Core: Cross-cutting concerns and utilities
 */

// ========================================
// DOMAIN SERVICES (Business Logic)
// ========================================

/**
 * Domain services handle business logic specific to application domains
 * These services orchestrate core business operations
 */
export * from './domain';

// Backward compatibility exports for domain services
export * from './domain/swap';
export * from './domain/portfolio';
export * from './domain/liquidity';
export * from './domain/token';
export * from './domain/wrapped';
export * from './domain/analytics';
export * from './domain/defi';

// ========================================
// INFRASTRUCTURE SERVICES (External I/O)
// ========================================

/**
 * Infrastructure services handle external integrations
 * These services manage communication with external systems
 */
export * from './infrastructure';

// Backward compatibility exports for infrastructure services
export * from './infrastructure/api';
export * from './infrastructure/blockchain';
export * from './infrastructure/realtime';

// ========================================
// CORE SERVICES (Cross-cutting Concerns)
// ========================================

/**
 * Core services provide cross-cutting concerns and utilities
 * These services are used across all layers
 */
export * from './core';

// Backward compatibility exports for core services
export * from './core/cache';
export * from './core/logger';
export * from './core/error';
export * from './core/storage';
export * from './core/security';
export * from './core/validation';

// ========================================
// LEGACY EXPORTS (To be refactored)
// ========================================

// Notification services (to be moved to core/notifications)
export * from './notification/toast.service';
export * from './notification/push.service';

// Export services (to be moved to core/export)
export * from './export/pdf.service';
export * from './export/csv.service';

// Shared utilities (already properly structured)
export * from './shared';
