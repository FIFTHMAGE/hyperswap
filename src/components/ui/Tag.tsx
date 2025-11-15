/**
 * Tag component with close button
 * @module components/ui
 */

'use client';

import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  onClose?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Tag({ children, onClose, variant = 'default', className = '' }: TagProps) {
  const variants = {
    default: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
