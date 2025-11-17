/**
 * UI constants (breakpoints, colors, animations, z-index)
 * @module constants/ui
 */

/**
 * Breakpoints for responsive design (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

/**
 * Animation easing functions
 */
export const ANIMATION_EASINGS = {
  LINEAR: 'linear',
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1100,
  MODAL_BACKDROP: 1200,
  MODAL: 1300,
  POPOVER: 1400,
  TOOLTIP: 1500,
  NOTIFICATION: 1600,
} as const;

/**
 * Common component sizes
 */
export const SIZES = {
  BUTTON: {
    SM: 'h-8 px-3 text-sm',
    MD: 'h-10 px-4 text-base',
    LG: 'h-12 px-6 text-lg',
  },
  INPUT: {
    SM: 'h-8 px-3 text-sm',
    MD: 'h-10 px-4 text-base',
    LG: 'h-12 px-4 text-lg',
  },
  ICON: {
    XS: 12,
    SM: 16,
    MD: 20,
    LG: 24,
    XL: 32,
  },
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  SM: '0.25rem', // 4px
  DEFAULT: '0.5rem', // 8px
  MD: '0.75rem', // 12px
  LG: '1rem', // 16px
  XL: '1.5rem', // 24px
  FULL: '9999px',
} as const;

/**
 * Box shadow presets
 */
export const SHADOWS = {
  SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

/**
 * Toast notification positions
 */
export const TOAST_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
} as const;

/**
 * Maximum display values
 */
export const MAX_DISPLAY = {
  TOKENS: 100,
  TRANSACTIONS: 50,
  POOLS: 50,
  HISTORY_ITEMS: 20,
} as const;
