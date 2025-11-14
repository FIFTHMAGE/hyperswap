/**
 * Favorite tokens hook
 * @module hooks/domain/useFavoriteTokens
 */

import { useState, useEffect } from 'react';
import {
  getFavoriteTokens,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  type FavoriteToken,
} from '@/services/token/favorites.service';

export function useFavoriteTokens() {
  const [favorites, setFavorites] = useState<FavoriteToken[]>([]);

  useEffect(() => {
    setFavorites(getFavoriteTokens());
  }, []);

  const addFavorite = (token: Omit<FavoriteToken, 'addedAt'>) => {
    addToFavorites(token);
    setFavorites(getFavoriteTokens());
  };

  const removeFavorite = (chainId: number, address: string) => {
    removeFromFavorites(chainId, address);
    setFavorites(getFavoriteTokens());
  };

  const checkIsFavorite = (chainId: number, address: string) => {
    return isFavorite(chainId, address);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite: checkIsFavorite,
  };
}

