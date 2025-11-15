/**
 * Toast notification component
 */

import React from 'react';
import { BaseComponentProps, ComponentVariant } from '../shared/prop-types';
import { cn } from '../shared/component-utils';

export interface ToastProps extends BaseComponentProps {
  title: string;
  description?: string;
  variant?: ComponentVariant;
  duration?: number;
  onClose?: () => void;
}

const variantStyles: Record<ComponentVariant, string> = {
  primary: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
  secondary: 'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:text-green-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:text-red-100',
  info: 'bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-100',
};

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'primary',
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md',
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
};

