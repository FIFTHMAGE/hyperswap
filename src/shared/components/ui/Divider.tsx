/**
 * Divider component
 * @module components/ui
 */

'use client';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={`w-px bg-gray-200 dark:bg-gray-700 ${className}`} />;
  }

  return <div className={`h-px bg-gray-200 dark:bg-gray-700 ${className}`} />;
}
