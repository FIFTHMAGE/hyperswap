/**
 * Card component
 * @module components/ui
 */

'use client';

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  className?: string;
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  padding = 'md',
  bordered = true,
  hoverable = false,
  className = '',
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`rounded-lg bg-white dark:bg-gray-800 
        ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
        ${hoverable ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}`}
    >
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 dark:border-gray-700 ${paddings[padding]}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer && (
        <div className={`border-t border-gray-200 dark:border-gray-700 ${paddings[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
