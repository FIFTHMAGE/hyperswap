/**
 * useFavorites - React hook for favorite tokens
 * @module hooks
 */

import { useState, useCallback } from 'react';

import { favoritesManager, FavoriteToken } from '../features/favorites/FavoritesManager';

export function useFavorites(chainId?: number) {
  const [favorites, setFavorites] = useState<FavoriteToken[]>(() => {
    if (chainId) {
      return favoritesManager.getFavoritesByChain(chainId);
    }
    return favoritesManager.getAllFavorites();
  });

  const loadFavorites = useCallback(() => {
    if (chainId) {
      setFavorites(favoritesManager.getFavoritesByChain(chainId));
    } else {
      setFavorites(favoritesManager.getAllFavorites());
    }
  }, [chainId]);

  const addFavorite = useCallback(
    (token: Omit<FavoriteToken, 'addedAt'>) => {
      favoritesManager.addFavorite(token);
      loadFavorites();
    },
    [loadFavorites]
  );

  const removeFavorite = useCallback(
    (address: string, tokenChainId: number) => {
      favoritesManager.removeFavorite(address, tokenChainId);
      loadFavorites();
    },
    [loadFavorites]
  );

  const toggleFavorite = useCallback(
    (token: Omit<FavoriteToken, 'addedAt'>) => {
      const isFav = favoritesManager.toggleFavorite(token);
      loadFavorites();
      return isFav;
    },
    [loadFavorites]
  );

  const isFavorite = useCallback((address: string, tokenChainId: number) => {
    return favoritesManager.isFavorite(address, tokenChainId);
  }, []);

  const clearFavorites = useCallback(() => {
    favoritesManager.clearFavorites();
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
