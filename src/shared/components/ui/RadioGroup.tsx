/**
 * Radio group component
 * @module components/ui
 */

'use client';

import { type ReactNode } from 'react';

interface RadioGroupProps {
  children: ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

export function RadioGroup({ children, label, error, className = '' }: RadioGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="space-y-2">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
