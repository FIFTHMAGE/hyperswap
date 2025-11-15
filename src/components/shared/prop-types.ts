/**
 * Shared component prop types and interfaces
 */

import { ReactNode } from 'react';

// Base props that all components can extend
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Common UI state props
export interface LoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface ErrorProps {
  error?: Error | string | null;
  onErrorDismiss?: () => void;
}

export interface DisabledProps {
  disabled?: boolean;
  disabledReason?: string;
}

// Size variants
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Common component props
export interface ButtonBaseProps extends BaseComponentProps, LoadingProps, DisabledProps {
  onClick?: () => void | Promise<void>;
  size?: ComponentSize;
  variant?: ComponentVariant;
  fullWidth?: boolean;
}

export interface InputBaseProps extends BaseComponentProps, DisabledProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  hoverable?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ComponentSize;
  closeOnOverlayClick?: boolean;
}

// Utility type to make all props optional except specified keys
export type RequireProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Utility type to omit specific props
export type OmitProps<T, K extends keyof T> = Omit<T, K>;

