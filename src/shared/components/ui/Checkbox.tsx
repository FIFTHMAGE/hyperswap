/**
 * Checkbox component
 * @module components/ui
 */

'use client';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  className = '',
}: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="
            w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded
            focus:ring-2 focus:ring-blue-500 disabled:opacity-50
          "
        />
        {indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-0.5 bg-blue-600" />
          </div>
        )}
      </div>
      {label && <span className="text-gray-900 dark:text-white">{label}</span>}
    </label>
  );
}
