/**
 * SlippageSettings Component
 * Configure slippage tolerance for swaps
 */

import React, { useState, useCallback, useMemo } from 'react';

export interface SlippageSettingsProps {
  value: number;
  onChange: (value: number) => void;
  presets?: number[];
  maxSlippage?: number;
  showWarnings?: boolean;
  className?: string;
}

export const SlippageSettings: React.FC<SlippageSettingsProps> = ({
  value,
  onChange,
  presets = [0.1, 0.5, 1.0],
  maxSlippage = 50,
  showWarnings = true,
  className = '',
}) => {
  const [isCustom, setIsCustom] = useState(!presets.includes(value));
  const [customValue, setCustomValue] = useState(value.toString());

  const warning = useMemo(() => {
    if (value < 0.05) {
      return {
        level: 'error' as const,
        message: 'Transaction may fail due to extremely low slippage',
      };
    }
    if (value < 0.1) {
      return {
        level: 'warning' as const,
        message: 'Your transaction may fail',
      };
    }
    if (value > 5) {
      return {
        level: 'error' as const,
        message: 'Your transaction may be frontrun',
      };
    }
    if (value > 1) {
      return {
        level: 'warning' as const,
        message: 'High slippage increases frontrun risk',
      };
    }
    return null;
  }, [value]);

  const handlePresetClick = useCallback((preset: number) => {
    setIsCustom(false);
    onChange(preset);
  }, [onChange]);

  const handleCustomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCustomValue(inputValue);
    
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxSlippage) {
      onChange(numValue);
    }
  }, [onChange, maxSlippage]);

  const handleCustomFocus = useCallback(() => {
    setIsCustom(true);
    if (!customValue || presets.includes(parseFloat(customValue))) {
      setCustomValue('');
    }
  }, [customValue, presets]);

  const handleCustomBlur = useCallback(() => {
    if (!customValue || customValue === '') {
      setIsCustom(false);
      setCustomValue(value.toString());
    }
  }, [customValue, value]);

  return (
    <div className={`bg-slate-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-400">Slippage Tolerance</h4>
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold text-white">{value.toFixed(1)}</span>
          <span className="text-gray-400">%</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              value === preset && !isCustom
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {preset}%
          </button>
        ))}

        {/* Custom Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={isCustom ? customValue : ''}
            onChange={handleCustomChange}
            onFocus={handleCustomFocus}
            onBlur={handleCustomBlur}
            placeholder="Custom"
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium text-center outline-none transition-colors ${
              isCustom
                ? 'bg-blue-600 text-white placeholder-blue-300'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600 placeholder-gray-500'
            }`}
          />
          {isCustom && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300">
              %
            </span>
          )}
        </div>
      </div>

      {/* Visual Slider */}
      <div className="mb-3">
        <input
          type="range"
          min="0.01"
          max="5"
          step="0.01"
          value={Math.min(value, 5)}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            onChange(newValue);
            setCustomValue(newValue.toString());
            setIsCustom(!presets.includes(newValue));
          }}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.01%</span>
          <span>Safe</span>
          <span>Risky</span>
          <span>5%+</span>
        </div>
      </div>

      {/* Warning Messages */}
      {showWarnings && warning && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg ${
            warning.level === 'error'
              ? 'bg-red-900/30 text-red-400'
              : 'bg-yellow-900/30 text-yellow-400'
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            {warning.level === 'error' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            )}
          </svg>
          <span className="text-sm">{warning.message}</span>
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-gray-500 mt-3">
        Your transaction will revert if the price changes unfavorably by more than this percentage.
      </p>
    </div>
  );
};

export default React.memo(SlippageSettings);

