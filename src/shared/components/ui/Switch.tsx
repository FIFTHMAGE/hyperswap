/**
 * Switch component
 * @module components/ui
 */

'use client';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
}: SwitchProps) {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors
            ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </div>
      </div>
      {label && <span className="text-gray-900 dark:text-white">{label}</span>}
    </label>
  );
}
