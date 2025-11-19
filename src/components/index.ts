/**
 * Components barrel export - Organized by abstraction level
 * @module components
 *
 * Component Architecture:
 * 1. Primitives: Foundational UI building blocks (Button, Input, etc.)
 * 2. Compositions: Combinations of primitives (FormField, SearchInput, etc.)
 * 3. Domain: Business logic components (Swap, Portfolio, Liquidity, etc.)
 * 4. Features: Complete feature modules
 * 5. Layouts: Page layout components
 */

// ========================================
// LEVEL 1: PRIMITIVES (Foundational UI)
// ========================================
export * from './primitives';

// ========================================
// LEVEL 2: COMPOSITIONS (Primitive Combos)
// ========================================
export * from './compositions';

// ========================================
// LEVEL 3: DOMAIN (Business Logic)
// ========================================
export * from './domain';

// ========================================
// LEVEL 4: FEATURES (Complete Modules)
// ========================================
export * from './features';

// ========================================
// LEVEL 5: LAYOUTS (Page Structure)
// ========================================
export * from './layouts';

// ========================================
// BACKWARD COMPATIBILITY (Legacy Exports)
// ========================================

// UI Components (moving to primitives)
export * from './ui';

// Dashboard Components
export * from './dashboard';

// Direct domain exports (prefer using ./domain)
export * from './swap';
export * from './portfolio';
export * from './liquidity';
export * from './wrapped';

// Wallet Components
export * from './wallet';

// Mobile Components
export * from './mobile';

// Pattern Components
export * from './patterns';

// Feedback Components
export * from './feedback';

// Common Components
export * from './common';

// HOC Components
export * from './HOCs';
