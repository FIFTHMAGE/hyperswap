/**
 * Chip component
 * @module components/ui
 */

'use client';

import type { ReactNode } from 'react';

interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  onDelete?: () => void;
  className?: string;
}

export function Chip({
  label,
  variant = 'default',
  size = 'md',
  icon,
  onDelete,
  className = '',
}: ChipProps) {
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      <span>{label}</span>
      {onDelete && (
        <button onClick={onDelete} className="hover:opacity-70 transition-opacity">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
