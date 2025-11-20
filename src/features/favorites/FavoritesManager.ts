/**
 * FavoritesManager - Manage favorite tokens
 * @module features/favorites
 */

import { Logger } from '../../utils/logger';
import { storageManager, StorageKey } from '../storage/StorageManager';

const logger = new Logger('FavoritesManager');

export interface FavoriteToken {
  address: string;
  symbol: string;
  name: string;
  chainId: number;
  addedAt: number;
}

export class FavoritesManager {
  private favorites: Map<string, FavoriteToken> = new Map();

  constructor() {
    this.loadFavorites();
  }

  /**
   * Add token to favorites
   */
  addFavorite(token: Omit<FavoriteToken, 'addedAt'>): void {
    const key = this.getKey(token.address, token.chainId);

    if (this.favorites.has(key)) {
      logger.warn(`Token ${token.symbol} already in favorites`);
      return;
    }

    const favorite: FavoriteToken = {
      ...token,
      addedAt: Date.now(),
    };

    this.favorites.set(key, favorite);
    this.saveFavorites();
    logger.info(`Added ${token.symbol} to favorites`);
  }

  /**
   * Remove token from favorites
   */
  removeFavorite(address: string, chainId: number): void {
    const key = this.getKey(address, chainId);
    const deleted = this.favorites.delete(key);

    if (deleted) {
      this.saveFavorites();
      logger.info(`Removed token from favorites: ${address}`);
    }
  }

  /**
   * Check if token is favorite
   */
  isFavorite(address: string, chainId: number): boolean {
    const key = this.getKey(address, chainId);
    return this.favorites.has(key);
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(token: Omit<FavoriteToken, 'addedAt'>): boolean {
    if (this.isFavorite(token.address, token.chainId)) {
      this.removeFavorite(token.address, token.chainId);
      return false;
    } else {
      this.addFavorite(token);
      return true;
    }
  }

  /**
   * Get all favorites
   */
  getAllFavorites(): FavoriteToken[] {
    return Array.from(this.favorites.values()).sort((a, b) => b.addedAt - a.addedAt);
  }

  /**
   * Get favorites by chain
   */
  getFavoritesByChain(chainId: number): FavoriteToken[] {
    return this.getAllFavorites().filter((token) => token.chainId === chainId);
  }

  /**
   * Get favorite token
   */
  getFavorite(address: string, chainId: number): FavoriteToken | undefined {
    const key = this.getKey(address, chainId);
    return this.favorites.get(key);
  }

  /**
   * Clear all favorites
   */
  clearFavorites(): void {
    this.favorites.clear();
    this.saveFavorites();
    logger.info('Cleared all favorites');
  }

  /**
   * Get favorites count
   */
  getFavoritesCount(): number {
    return this.favorites.size;
  }

  /**
   * Import favorites
   */
  importFavorites(tokens: FavoriteToken[]): void {
    tokens.forEach((token) => {
      const key = this.getKey(token.address, token.chainId);
      this.favorites.set(key, token);
    });
    this.saveFavorites();
    logger.info(`Imported ${tokens.length} favorites`);
  }

  /**
   * Export favorites
   */
  exportFavorites(): FavoriteToken[] {
    return this.getAllFavorites();
  }

  /**
   * Get storage key for token
   */
  private getKey(address: string, chainId: number): string {
    return `${chainId}:${address.toLowerCase()}`;
  }

  /**
   * Save favorites to storage
   */
  private saveFavorites(): void {
    try {
      const favoritesArray = this.getAllFavorites();
      storageManager.set(StorageKey.FAVORITE_TOKENS, favoritesArray);
    } catch (error) {
      logger.error('Failed to save favorites:', error as Error);
    }
  }

  /**
   * Load favorites from storage
   */
  private loadFavorites(): void {
    try {
      const favoritesArray = storageManager.get<FavoriteToken[]>(StorageKey.FAVORITE_TOKENS);

      if (favoritesArray && Array.isArray(favoritesArray)) {
        favoritesArray.forEach((token) => {
          const key = this.getKey(token.address, token.chainId);
          this.favorites.set(key, token);
        });
        logger.info(`Loaded ${favoritesArray.length} favorites from storage`);
      }
    } catch (error) {
      logger.error('Failed to load favorites:', error as Error);
    }
  }
}

export const favoritesManager = new FavoritesManager();
