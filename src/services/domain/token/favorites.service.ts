/**
 * Token favorites service
 * @module services/token/favorites
 */

import { getItem, setItem } from '@/utils/browser/storage';

const FAVORITES_KEY = 'favorite_tokens';

export interface FavoriteToken {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  addedAt: number;
}

/**
 * Get favorite tokens
 */
export function getFavoriteTokens(): FavoriteToken[] {
  return getItem<FavoriteToken[]>(FAVORITES_KEY) || [];
}

/**
 * Add token to favorites
 */
export function addToFavorites(token: Omit<FavoriteToken, 'addedAt'>): void {
  const favorites = getFavoriteTokens();
  
  const exists = favorites.some(
    f => f.chainId === token.chainId && f.address.toLowerCase() === token.address.toLowerCase()
  );
  
  if (!exists) {
    favorites.push({
      ...token,
      addedAt: Date.now(),
    });
    setItem(FAVORITES_KEY, favorites);
  }
}

/**
 * Remove from favorites
 */
export function removeFromFavorites(chainId: number, address: string): void {
  const favorites = getFavoriteTokens();
  const filtered = favorites.filter(
    f => !(f.chainId === chainId && f.address.toLowerCase() === address.toLowerCase())
  );
  setItem(FAVORITES_KEY, filtered);
}

/**
 * Check if token is favorite
 */
export function isFavorite(chainId: number, address: string): boolean {
  const favorites = getFavoriteTokens();
  return favorites.some(
    f => f.chainId === chainId && f.address.toLowerCase() === address.toLowerCase()
  );
}

/**
 * Clear all favorites
 */
export function clearFavorites(): void {
  setItem(FAVORITES_KEY, []);
}

/**
 * Get favorites by chain
 */
export function getFavoritesByChain(chainId: number): FavoriteToken[] {
  return getFavoriteTokens().filter(f => f.chainId === chainId);
}

