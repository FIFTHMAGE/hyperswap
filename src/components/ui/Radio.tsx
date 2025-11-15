/**
 * Radio component
 * @module components/ui
 */

'use client';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export function RadioGroup({ options, value, onChange, name, className = '' }: RadioGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700
            ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'}
            ${value === option.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={option.disabled}
            className="mt-0.5"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
            {option.description && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {option.description}
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
