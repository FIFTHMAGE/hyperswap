/**
 * Hooks barrel export
 * @module hooks
 *
 * Organized into:
 * - factories: Reusable hook generators for common patterns
 * - core: General utility hooks
 * - domain: Business logic hooks
 * - features: Feature-specific hooks
 * - data: Data fetching and management hooks
 * - form: Form handling hooks
 * - lifecycle: Component lifecycle hooks
 * - performance: Performance optimization hooks
 * - ui: UI interaction hooks
 * - validation: Input validation hooks
 */

// Hook factories (NEW: Create custom hooks from patterns)
export * from './factories';

// Export all hooks from subdirectories
export * from './core';
export * from './domain';
export * from './features';
export * from './data';
export * from './form';
export * from './lifecycle';
export * from './performance';
export * from './ui';
export * from './validation';
