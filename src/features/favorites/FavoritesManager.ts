/**
 * Favorites Manager
 * Manages user's favorite tokens and trading pairs
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface FavoriteToken {
  id: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  addedAt: Date;
  chainId: number;
}

export interface FavoritePair {
  id: string;
  tokenIn: string;
  tokenOut: string;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  addedAt: Date;
  lastTraded?: Date;
  tradeCount: number;
}

const STORAGE_KEY_TOKENS = 'hyperswap_favorite_tokens';
const STORAGE_KEY_PAIRS = 'hyperswap_favorite_pairs';
const MAX_FAVORITES = 50;

export class FavoritesManager {
  private static instance: FavoritesManager;
  private tokens: Map<string, FavoriteToken> = new Map();
  private pairs: Map<string, FavoritePair> = new Map();
  private storageManager: StorageManager;
  private listeners: Set<() => void> = new Set();

  private constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
    this.loadData();
    logger.info('FavoritesManager initialized.');
  }

  public static getInstance(storageManager: StorageManager): FavoritesManager {
    if (!FavoritesManager.instance) {
      FavoritesManager.instance = new FavoritesManager(storageManager);
    }
    return FavoritesManager.instance;
  }

  private loadData(): void {
    try {
      // Load tokens
      const storedTokens = this.storageManager.get<FavoriteToken[]>(STORAGE_KEY_TOKENS);
      if (storedTokens && Array.isArray(storedTokens)) {
        storedTokens.forEach((token) => {
          this.tokens.set(token.id, {
            ...token,
            addedAt: new Date(token.addedAt),
          });
        });
      }

      // Load pairs
      const storedPairs = this.storageManager.get<FavoritePair[]>(STORAGE_KEY_PAIRS);
      if (storedPairs && Array.isArray(storedPairs)) {
        storedPairs.forEach((pair) => {
          this.pairs.set(pair.id, {
            ...pair,
            addedAt: new Date(pair.addedAt),
            lastTraded: pair.lastTraded ? new Date(pair.lastTraded) : undefined,
          });
        });
      }
    } catch (error) {
      logger.error('Failed to load favorites from storage:', error);
    }
  }

  private saveData(): void {
    try {
      this.storageManager.set(STORAGE_KEY_TOKENS, Array.from(this.tokens.values()));
      this.storageManager.set(STORAGE_KEY_PAIRS, Array.from(this.pairs.values()));
      logger.debug('Favorites saved to storage.');
    } catch (error) {
      logger.error('Failed to save favorites to storage:', error);
    }
  }

  /**
   * Add a token to favorites
   */
  addToken(
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    chainId: number,
    logoURI?: string
  ): string {
    const id = `${chainId}-${address.toLowerCase()}`;

    if (this.tokens.has(id)) {
      logger.info(`Token ${symbol} already in favorites`);
      return id;
    }

    if (this.tokens.size >= MAX_FAVORITES) {
      throw new Error('Maximum number of favorite tokens reached');
    }

    const token: FavoriteToken = {
      id,
      address: address.toLowerCase(),
      symbol,
      name,
      decimals,
      logoURI,
      addedAt: new Date(),
      chainId,
    };

    this.tokens.set(id, token);
    this.saveData();
    this.notifyListeners();

    logger.info(`Token ${symbol} added to favorites`);
    return id;
  }

  /**
   * Remove a token from favorites
   */
  removeToken(id: string): boolean {
    const removed = this.tokens.delete(id);

    if (removed) {
      this.saveData();
      this.notifyListeners();
      logger.info(`Token ${id} removed from favorites`);
    }

    return removed;
  }

  /**
   * Check if a token is favorited
   */
  isTokenFavorited(address: string, chainId: number): boolean {
    const id = `${chainId}-${address.toLowerCase()}`;
    return this.tokens.has(id);
  }

  /**
   * Get all favorite tokens
   */
  getAllTokens(): FavoriteToken[] {
    return Array.from(this.tokens.values()).sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
    );
  }

  /**
   * Get favorite tokens by chain
   */
  getTokensByChain(chainId: number): FavoriteToken[] {
    return this.getAllTokens().filter((token) => token.chainId === chainId);
  }

  /**
   * Search favorite tokens
   */
  searchTokens(query: string): FavoriteToken[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTokens().filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Add a trading pair to favorites
   */
  addPair(
    tokenIn: string,
    tokenOut: string,
    tokenInSymbol: string,
    tokenOutSymbol: string
  ): string {
    const id = `${tokenIn.toLowerCase()}-${tokenOut.toLowerCase()}`;

    if (this.pairs.has(id)) {
      logger.info(`Pair ${tokenInSymbol}/${tokenOutSymbol} already in favorites`);
      return id;
    }

    if (this.pairs.size >= MAX_FAVORITES) {
      throw new Error('Maximum number of favorite pairs reached');
    }

    const pair: FavoritePair = {
      id,
      tokenIn: tokenIn.toLowerCase(),
      tokenOut: tokenOut.toLowerCase(),
      tokenInSymbol,
      tokenOutSymbol,
      addedAt: new Date(),
      tradeCount: 0,
    };

    this.pairs.set(id, pair);
    this.saveData();
    this.notifyListeners();

    logger.info(`Pair ${tokenInSymbol}/${tokenOutSymbol} added to favorites`);
    return id;
  }

  /**
   * Remove a trading pair from favorites
   */
  removePair(id: string): boolean {
    const removed = this.pairs.delete(id);

    if (removed) {
      this.saveData();
      this.notifyListeners();
      logger.info(`Pair ${id} removed from favorites`);
    }

    return removed;
  }

  /**
   * Check if a pair is favorited
   */
  isPairFavorited(tokenIn: string, tokenOut: string): boolean {
    const id = `${tokenIn.toLowerCase()}-${tokenOut.toLowerCase()}`;
    return this.pairs.has(id);
  }

  /**
   * Update pair trade statistics
   */
  recordPairTrade(tokenIn: string, tokenOut: string): void {
    const id = `${tokenIn.toLowerCase()}-${tokenOut.toLowerCase()}`;
    const pair = this.pairs.get(id);

    if (pair) {
      pair.tradeCount++;
      pair.lastTraded = new Date();
      this.saveData();
      this.notifyListeners();
    }
  }

  /**
   * Get all favorite pairs
   */
  getAllPairs(): FavoritePair[] {
    return Array.from(this.pairs.values()).sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
    );
  }

  /**
   * Get most traded pairs
   */
  getMostTradedPairs(limit: number = 10): FavoritePair[] {
    return this.getAllPairs()
      .sort((a, b) => b.tradeCount - a.tradeCount)
      .slice(0, limit);
  }

  /**
   * Get recently traded pairs
   */
  getRecentlyTradedPairs(limit: number = 10): FavoritePair[] {
    return this.getAllPairs()
      .filter((pair) => pair.lastTraded)
      .sort((a, b) => {
        if (!a.lastTraded || !b.lastTraded) return 0;
        return b.lastTraded.getTime() - a.lastTraded.getTime();
      })
      .slice(0, limit);
  }

  /**
   * Search favorite pairs
   */
  searchPairs(query: string): FavoritePair[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPairs().filter(
      (pair) =>
        pair.tokenInSymbol.toLowerCase().includes(lowerQuery) ||
        pair.tokenOutSymbol.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get pairs involving a specific token
   */
  getPairsByToken(tokenAddress: string): FavoritePair[] {
    const lowerAddress = tokenAddress.toLowerCase();
    return this.getAllPairs().filter(
      (pair) => pair.tokenIn === lowerAddress || pair.tokenOut === lowerAddress
    );
  }

  /**
   * Import favorites from JSON
   */
  importFavorites(data: { tokens?: FavoriteToken[]; pairs?: FavoritePair[] }): void {
    try {
      if (data.tokens && Array.isArray(data.tokens)) {
        data.tokens.forEach((token) => {
          if (!this.tokens.has(token.id) && this.tokens.size < MAX_FAVORITES) {
            this.tokens.set(token.id, {
              ...token,
              addedAt: new Date(token.addedAt),
            });
          }
        });
      }

      if (data.pairs && Array.isArray(data.pairs)) {
        data.pairs.forEach((pair) => {
          if (!this.pairs.has(pair.id) && this.pairs.size < MAX_FAVORITES) {
            this.pairs.set(pair.id, {
              ...pair,
              addedAt: new Date(pair.addedAt),
              lastTraded: pair.lastTraded ? new Date(pair.lastTraded) : undefined,
            });
          }
        });
      }

      this.saveData();
      this.notifyListeners();
      logger.info('Favorites imported successfully');
    } catch (error) {
      logger.error('Failed to import favorites:', error);
      throw error;
    }
  }

  /**
   * Export favorites to JSON
   */
  exportFavorites(): { tokens: FavoriteToken[]; pairs: FavoritePair[] } {
    return {
      tokens: this.getAllTokens(),
      pairs: this.getAllPairs(),
    };
  }

  /**
   * Clear all favorites
   */
  clearAll(): void {
    this.tokens.clear();
    this.pairs.clear();
    this.saveData();
    this.notifyListeners();
    logger.info('All favorites cleared');
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.tokens.clear();
    this.saveData();
    this.notifyListeners();
    logger.info('All favorite tokens cleared');
  }

  /**
   * Clear all pairs
   */
  clearPairs(): void {
    this.pairs.clear();
    this.saveData();
    this.notifyListeners();
    logger.info('All favorite pairs cleared');
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalTokens: number;
    totalPairs: number;
    totalTrades: number;
    mostTradedPair?: FavoritePair;
    recentlyAdded: { tokens: number; pairs: number };
  } {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentTokens = this.getAllTokens().filter((t) => t.addedAt > oneDayAgo).length;
    const recentPairs = this.getAllPairs().filter((p) => p.addedAt > oneDayAgo).length;

    const totalTrades = this.getAllPairs().reduce((sum, pair) => sum + pair.tradeCount, 0);

    const mostTraded = this.getMostTradedPairs(1)[0];

    return {
      totalTokens: this.tokens.size,
      totalPairs: this.pairs.size,
      totalTrades,
      mostTradedPair: mostTraded,
      recentlyAdded: {
        tokens: recentTokens,
        pairs: recentPairs,
      },
    };
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        logger.error('Error notifying favorites listener:', error);
      }
    });
  }

  /**
   * Merge favorites from another source
   */
  mergeFavorites(other: { tokens: FavoriteToken[]; pairs: FavoritePair[] }): void {
    let added = 0;

    other.tokens.forEach((token) => {
      if (!this.tokens.has(token.id) && this.tokens.size < MAX_FAVORITES) {
        this.tokens.set(token.id, token);
        added++;
      }
    });

    other.pairs.forEach((pair) => {
      if (!this.pairs.has(pair.id) && this.pairs.size < MAX_FAVORITES) {
        this.pairs.set(pair.id, pair);
        added++;
      }
    });

    if (added > 0) {
      this.saveData();
      this.notifyListeners();
      logger.info(`Merged ${added} favorites`);
    }
  }
}

// Singleton instance
export const favoritesManager = FavoritesManager.getInstance(StorageManager.getInstance());
