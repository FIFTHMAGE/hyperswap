/**
 * Textarea component
 * @module components/ui
 */

'use client';

import type { ChangeEvent } from 'react';

interface TextareaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export function Textarea({
  value,
  onChange,
  label,
  placeholder,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
}: TextareaProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
          text-gray-900 dark:text-white`}
      />
      <div className="flex justify-between mt-1">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {maxLength && (
          <p className="text-sm text-gray-500 ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
