'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from '@/lib/types/swap';
import { tokenListService } from '@/lib/api/token-list';
import { useTokenFavorites } from '@/hooks/useTokenFavorites';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken?: Token;
  chainId?: number;
}

export function TokenSelector({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  chainId,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const { favorites, isFavorite, toggleFavorite } = useTokenFavorites();

  useEffect(() => {
    if (isOpen) {
      loadTokens();
    }
  }, [isOpen, chainId]);

  const loadTokens = async () => {
    // Load default token lists if not already loaded
    await tokenListService.loadDefaultLists();
    
    // Get popular tokens initially
    const popularTokens = tokenListService.getPopularTokens(chainId, 50);
    setTokens(popularTokens);
  };

  const filteredTokens = useMemo(() => {
    let result = tokens;

    if (activeTab === 'favorites') {
      result = favorites.filter((token) => !chainId || token.chainId === chainId);
    }

    if (searchQuery.trim()) {
      const searchResults = tokenListService.searchTokens(searchQuery, chainId);
      result = searchResults.length > 0 ? searchResults : result;
    }

    // Filter out already selected token
    if (selectedToken) {
      result = result.filter(
        (token) =>
          !(
            token.address.toLowerCase() === selectedToken.address.toLowerCase() &&
            token.chainId === selectedToken.chainId
          )
      );
    }

    return result.slice(0, 100); // Limit to 100 results
  }, [tokens, searchQuery, activeTab, favorites, chainId, selectedToken]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Select Token
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Tokens
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'favorites'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ⭐ Favorites
              </button>
            </div>
          </div>

          {/* Token List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredTokens.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {activeTab === 'favorites'
                  ? 'No favorite tokens yet'
                  : 'No tokens found'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <motion.div
                    key={`${token.chainId}-${token.address}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                    onClick={() => handleSelect(token)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ccc"/></svg>';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                          {token.symbol[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {token.symbol}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {token.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {token.balance && (
                        <div className="text-right mr-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {parseFloat(token.balance).toFixed(4)}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(token);
                        }}
                        className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isFavorite(token) ? '⭐' : '☆'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

