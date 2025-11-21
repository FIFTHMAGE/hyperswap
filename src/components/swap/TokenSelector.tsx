/**
 * Token Selector Component
 * Modal for selecting tokens with search and favorites
 */

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image } from 'react-native';

import { favoritesManager } from '../../features/favorites/FavoritesManager';
import { TokenRegistry } from '../../features/tokens/TokenRegistry';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken?: Token;
  excludeToken?: Token;
  chainId: number;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  excludeToken,
  chainId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [favoriteTokens, setFavoriteTokens] = useState<Token[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const loadTokens = () => {
      const tokenRegistry = TokenRegistry.getInstance();
      const allTokens = tokenRegistry.getTokensByChain(chainId);
      setTokens(allTokens as Token[]);

      const favorites = favoritesManager.getTokensByChain(chainId);
      setFavoriteTokens(favorites as Token[]);
    };

    loadTokens();

    const unsubscribe = favoritesManager.subscribe(() => {
      const updatedFavorites = favoritesManager.getTokensByChain(chainId);
      setFavoriteTokens(updatedFavorites as Token[]);
    });

    return unsubscribe;
  }, [chainId]);

  const filteredTokens = useMemo(() => {
    let result = showOnlyFavorites ? favoriteTokens : tokens;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }

    // Exclude specific token
    if (excludeToken) {
      result = result.filter(
        (token) => token.address.toLowerCase() !== excludeToken.address.toLowerCase()
      );
    }

    return result;
  }, [tokens, favoriteTokens, searchQuery, showOnlyFavorites, excludeToken]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
    setSearchQuery('');
  };

  const toggleFavorite = (token: Token) => {
    const isFavorited = favoritesManager.isTokenFavorited(token.address, token.chainId);

    if (isFavorited) {
      const id = `${token.chainId}-${token.address.toLowerCase()}`;
      favoritesManager.removeToken(id);
    } else {
      favoritesManager.addToken(
        token.address,
        token.symbol,
        token.name,
        token.decimals,
        token.chainId,
        token.logoURI
      );
    }
  };

  const isTokenFavorited = (token: Token) => {
    return favoritesManager.isTokenFavorited(token.address, token.chainId);
  };

  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <View className="w-full max-w-md rounded-lg bg-gray-800 shadow-xl">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-700 p-4">
          <Text className="text-xl font-bold text-white">Select Token</Text>
          <Pressable onPress={onClose} className="rounded-lg p-2 hover:bg-gray-700">
            <Text className="text-2xl text-gray-400">×</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View className="border-b border-gray-700 p-4">
          <TextInput
            className="rounded-lg bg-gray-700 px-4 py-3 text-white placeholder-gray-400"
            placeholder="Search by name, symbol, or address"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        {/* Filter Tabs */}
        <View className="flex-row border-b border-gray-700">
          <Pressable
            onPress={() => setShowOnlyFavorites(false)}
            className={`flex-1 border-b-2 px-4 py-3 ${
              !showOnlyFavorites ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                !showOnlyFavorites ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              All Tokens
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowOnlyFavorites(true)}
            className={`flex-1 border-b-2 px-4 py-3 ${
              showOnlyFavorites ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                showOnlyFavorites ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              Favorites ({favoriteTokens.length})
            </Text>
          </Pressable>
        </View>

        {/* Token List */}
        <ScrollView className="max-h-96">
          {filteredTokens.length === 0 ? (
            <View className="p-8">
              <Text className="text-center text-gray-400">
                {searchQuery ? 'No tokens found' : 'No tokens available'}
              </Text>
            </View>
          ) : (
            filteredTokens.map((token) => {
              const isSelected =
                selectedToken?.address.toLowerCase() === token.address.toLowerCase();
              const isFavorite = isTokenFavorited(token);

              return (
                <View
                  key={token.address}
                  className={`flex-row items-center justify-between border-b border-gray-700 p-4 hover:bg-gray-700 ${
                    isSelected ? 'bg-gray-700' : ''
                  }`}
                >
                  <Pressable
                    onPress={() => handleSelect(token)}
                    className="flex-1 flex-row items-center gap-3"
                  >
                    {/* Token Logo */}
                    {token.logoURI ? (
                      <Image
                        source={{ uri: token.logoURI }}
                        className="h-10 w-10 rounded-full"
                        alt={`${token.symbol} logo`}
                      />
                    ) : (
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-600">
                        <Text className="text-sm font-bold text-white">
                          {token.symbol.slice(0, 2)}
                        </Text>
                      </View>
                    )}

                    {/* Token Info */}
                    <View className="flex-1">
                      <Text className="font-semibold text-white">{token.symbol}</Text>
                      <Text className="text-sm text-gray-400">{token.name}</Text>
                    </View>
                  </Pressable>

                  {/* Favorite Button */}
                  <Pressable
                    onPress={() => toggleFavorite(token)}
                    className="rounded-lg p-2 hover:bg-gray-600"
                  >
                    <Text className={`text-xl ${isFavorite ? 'text-yellow-500' : 'text-gray-500'}`}>
                      {isFavorite ? '★' : '☆'}
                    </Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Footer Info */}
        <View className="border-t border-gray-700 p-4">
          <Text className="text-center text-xs text-gray-400">
            {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TokenSelector;
