/**
 * TokenSelector - Token selection modal component
 * @module features/swap/components
 */

import React, { useState, useMemo, useCallback } from 'react';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  price?: number;
}

export interface TokenSelectorProps {
  tokens: Token[];
  selectedToken?: Token;
  onSelect: (token: Token) => void;
  onClose: () => void;
  popularTokens?: string[];
  balances?: Record<string, string>;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onSelect,
  onClose,
  popularTokens = [],
  balances = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'imported'>('all');

  // Filter tokens based on search
  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let filtered = tokens;

    // Filter by tab
    if (activeTab === 'popular') {
      filtered = tokens.filter((t) => popularTokens.includes(t.address.toLowerCase()));
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }

    // Sort by balance (descending) if available
    return filtered.sort((a, b) => {
      const balanceA = parseFloat(balances[a.address] || '0');
      const balanceB = parseFloat(balances[b.address] || '0');
      return balanceB - balanceA;
    });
  }, [tokens, searchQuery, activeTab, popularTokens, balances]);

  const handleSelect = useCallback(
    (token: Token) => {
      onSelect(token);
      onClose();
    },
    [onSelect, onClose]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select a Token</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or paste address"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700">
          {[
            { id: 'all', label: 'All' },
            { id: 'popular', label: 'Popular' },
            { id: 'imported', label: 'Imported' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No tokens found' : 'No tokens available'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <TokenItem
                  key={token.address}
                  token={token}
                  balance={balances[token.address]}
                  isSelected={selectedToken?.address === token.address}
                  onSelect={() => handleSelect(token)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Manage Token Lists
          </button>
        </div>
      </div>
    </div>
  );
};

interface TokenItemProps {
  token: Token;
  balance?: string;
  isSelected: boolean;
  onSelect: () => void;
}

const TokenItem: React.FC<TokenItemProps> = ({ token, balance, isSelected, onSelect }) => {
  const formattedBalance = balance ? parseFloat(balance).toFixed(6) : '0';
  const balanceValue = balance && token.price ? parseFloat(balance) * token.price : undefined;

  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {/* Token Logo */}
      <div className="flex-shrink-0">
        {token.logoURI ? (
          <img src={token.logoURI} alt={token.symbol} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {token.symbol.substring(0, 1)}
          </div>
        )}
      </div>

      {/* Token Info */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">{token.symbol}</span>
          {isSelected && (
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{token.name}</div>
      </div>

      {/* Balance */}
      {balance && (
        <div className="text-right">
          <div className="font-medium text-gray-900 dark:text-white">{formattedBalance}</div>
          {balanceValue !== undefined && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ${balanceValue.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </button>
  );
};

/**
 * Hook for token selector state
 */
export function useTokenSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<'from' | 'to' | null>(null);

  const open = useCallback((field: 'from' | 'to') => {
    setSelectedField(field);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedField(null);
  }, []);

  return {
    isOpen,
    selectedField,
    open,
    close,
  };
}
