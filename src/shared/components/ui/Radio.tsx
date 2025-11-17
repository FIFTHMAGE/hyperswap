/**
 * Radio button component
 * @module components/ui
 */

'use client';

import type { ChangeEvent } from 'react';

interface RadioProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
}: RadioProps) {
  return (
    <label
      className={`inline-flex items-center cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
      />
      {label && <span className="ml-2 text-sm text-gray-900 dark:text-white">{label}</span>}
    </label>
  );
}
