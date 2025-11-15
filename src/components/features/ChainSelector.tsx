/**
 * Chain selector component
 * @module components/features
 */

'use client';

import { useState, useRef, useEffect } from 'react';

import type { Chain } from '@/types/blockchain.types';

interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain | null;
  onChainChange: (chain: Chain) => void;
  disabled?: boolean;
  className?: string;
}

export function ChainSelector({
  chains,
  selectedChain,
  onChainChange,
  disabled = false,
  className = '',
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChainSelect = (chain: Chain) => {
    onChainChange(chain);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedChain ? (
          <>
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium">{selectedChain.name.charAt(0)}</span>
            </div>
            <span className="font-medium">{selectedChain.name}</span>
          </>
        ) : (
          <span>Select Chain</span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => handleChainSelect(chain)}
              className={`
                w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                ${selectedChain?.id === chain.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">{chain.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{chain.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {chain.nativeCurrency.symbol}
                </div>
              </div>
              {selectedChain?.id === chain.id && (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
