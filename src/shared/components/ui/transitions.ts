/**
 * CSS transition utilities
 */

export const transitions = {
  // Common transition classes
  all: 'transition-all duration-200 ease-in-out',
  colors: 'transition-colors duration-200 ease-in-out',
  opacity: 'transition-opacity duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',

  // Duration variants
  fast: 'duration-100',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',

  // Easing functions
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',

  // Preset combinations
  button: 'transition-colors duration-150 ease-in-out',
  card: 'transition-all duration-200 ease-in-out',
  modal: 'transition-all duration-300 ease-out',
  dropdown: 'transition-opacity duration-150 ease-in-out',
} as const;

export const animations = {
  spin: 'animate-spin',
  ping: 'animate-ping',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const;
