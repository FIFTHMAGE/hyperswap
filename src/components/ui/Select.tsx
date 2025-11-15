/**
 * Select dropdown component
 * @module components/ui
 */

'use client';

import type { ChangeEvent, ReactNode } from 'react';

interface SelectProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  children,
  label,
  error,
  disabled = false,
  placeholder,
  className = '',
}: SelectProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
          text-gray-900 dark:text-white`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function SelectOption({ value, children }: { value: string; children: ReactNode }) {
  return <option value={value}>{children}</option>;
}
