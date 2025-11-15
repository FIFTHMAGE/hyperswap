/**
 * Accessibility utilities for components
 */

// ARIA role mappings
export const ariaRoles = {
  button: 'button',
  link: 'link',
  heading: 'heading',
  navigation: 'navigation',
  main: 'main',
  dialog: 'dialog',
  alert: 'alert',
  status: 'status',
  progressbar: 'progressbar',
} as const;

// Generate ARIA attributes for components
export function getAriaProps(props: {
  label?: string;
  describedBy?: string;
  expanded?: boolean;
  controls?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}) {
  return {
    'aria-label': props.label,
    'aria-describedby': props.describedBy,
    'aria-expanded': props.expanded,
    'aria-controls': props.controls,
    'aria-required': props.required,
    'aria-invalid': props.invalid,
    'aria-disabled': props.disabled,
  };
}

// Screen reader only text utility
export const srOnly = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

// Focus visible utility
export const focusVisible = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

// Keyboard navigation helper
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }
) {
  const { key } = event;
  
  switch (key) {
    case 'Enter':
      handlers.onEnter?.();
      break;
    case 'Escape':
      handlers.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      handlers.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      handlers.onArrowDown?.();
      break;
    case 'ArrowLeft':
      handlers.onArrowLeft?.();
      break;
    case 'ArrowRight':
      handlers.onArrowRight?.();
      break;
  }
}

