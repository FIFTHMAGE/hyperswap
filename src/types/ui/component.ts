/**
 * UI component prop types
 * @module types/ui/component
 */

import type { ReactNode } from 'react';

/**
 * Size variants
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * Button variants
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

/**
 * Button props
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: Size;
  color?: ColorVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Input props
 */
export interface InputProps extends BaseComponentProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  size?: Size;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

/**
 * Modal props
 */
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

/**
 * Toast/notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast props
 */
export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Loading state props
 */
export interface LoadingStateProps {
  loading: boolean;
  skeleton?: boolean;
  spinner?: boolean;
  text?: string;
}

