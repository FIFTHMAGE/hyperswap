/**
 * Type-related constants
 */

// Status constants
export const LOADING_STATES = ['idle', 'loading', 'success', 'error'] as const;
export const TRANSACTION_STATUSES = ['pending', 'confirmed', 'failed', 'cancelled'] as const;
export const THEME_MODES = ['light', 'dark', 'system'] as const;
export const TOAST_TYPES = ['success', 'error', 'warning', 'info'] as const;

// Size constants
export const COMPONENT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;

// Timeframe constants
export const CHART_TIMEFRAMES = ['1H', '1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;

// HTTP method constants
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

// Type assertions
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};
