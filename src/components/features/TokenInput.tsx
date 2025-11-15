/**
 * Token input component with token selector
 * @module components/features
 */

'use client';

import { useState } from 'react';

import type { Token } from '@/types/blockchain.types';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  balance?: string;
  disabled?: boolean;
  className?: string;
}

export function TokenInput({
  value,
  onChange,
  selectedToken,
  onTokenSelect: _onTokenSelect,
  balance,
  disabled = false,
  className = '',
}: TokenInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleMaxClick = () => {
    if (balance) {
      onChange(balance);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border ${isFocused ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="0.0"
          className="text-2xl font-semibold bg-transparent outline-none flex-1 disabled:opacity-50 text-gray-900 dark:text-white"
        />
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          disabled={disabled}
        >
          {selectedToken ? (
            <>
              {selectedToken.logoURI && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-medium">{selectedToken.symbol}</span>
            </>
          ) : (
            <span>Select Token</span>
          )}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {balance && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Balance: {balance}</span>
          <button
            type="button"
            onClick={handleMaxClick}
            disabled={disabled}
            className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
          >
            MAX
          </button>
        </div>
      )}
    </div>
  );
}
