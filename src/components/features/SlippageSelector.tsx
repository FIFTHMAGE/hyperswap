/**
 * Slippage tolerance selector component
 * @module components/features
 */

'use client';

import { useState } from 'react';

interface SlippageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const PRESET_VALUES = [0.1, 0.5, 1.0];

export function SlippageSelector({ value, onChange, className = '' }: SlippageSelectorProps) {
  const [isCustom, setIsCustom] = useState(!PRESET_VALUES.includes(value));
  const [customValue, setCustomValue] = useState(value.toString());

  const handlePresetClick = (preset: number) => {
    setIsCustom(false);
    onChange(preset);
  };

  const handleCustomChange = (input: string) => {
    setCustomValue(input);
    const numValue = parseFloat(input);

    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onChange(numValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Slippage Tolerance
      </label>
      <div className="flex items-center gap-2">
        {PRESET_VALUES.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePresetClick(preset)}
            className={`
              px-4 py-2 rounded-lg border transition-colors
              ${
                value === preset && !isCustom
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }
            `}
          >
            {preset}%
          </button>
        ))}
        <div className="flex-1">
          <input
            type="number"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            onFocus={() => setIsCustom(true)}
            min="0"
            max="50"
            step="0.1"
            placeholder="Custom"
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      {value > 5 && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          Warning: High slippage tolerance may result in unfavorable trades
        </p>
      )}
    </div>
  );
}
