/**
 * Custom hook for managing favorite tokens
 */

import { useState, useEffect } from 'react';
import { Token } from '@/lib/types/swap';

const FAVORITES_KEY = 'hyperswap_favorite_tokens';

export function useTokenFavorites() {
  const [favorites, setFavorites] = useState<Token[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = (newFavorites: Token[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = (token: Token) => {
    const exists = favorites.some(
      (fav) =>
        fav.address.toLowerCase() === token.address.toLowerCase() &&
        fav.chainId === token.chainId
    );

    if (!exists) {
      saveFavorites([...favorites, token]);
    }
  };

  const removeFavorite = (token: Token) => {
    const newFavorites = favorites.filter(
      (fav) =>
        !(
          fav.address.toLowerCase() === token.address.toLowerCase() &&
          fav.chainId === token.chainId
        )
    );
    saveFavorites(newFavorites);
  };

  const isFavorite = (token: Token): boolean => {
    return favorites.some(
      (fav) =>
        fav.address.toLowerCase() === token.address.toLowerCase() &&
        fav.chainId === token.chainId
    );
  };

  const toggleFavorite = (token: Token) => {
    if (isFavorite(token)) {
      removeFavorite(token);
    } else {
      addFavorite(token);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}

