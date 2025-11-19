/**
 * Button primitive component
 * @module components/primitives/Button
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Full width
   */
  fullWidth?: boolean;

  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;

  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  outline: 'border-2 border-gray-300 hover:border-gray-400',
  ghost: 'hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Button component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
