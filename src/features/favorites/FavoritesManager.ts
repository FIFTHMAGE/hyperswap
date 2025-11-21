/**
 * Favorites Manager
 * Handles user favorites for tokens, pairs, and addresses
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface FavoriteToken {
  address: string;
  symbol: string;
  name: string;
  chainId: number;
  addedAt: Date;
}

export interface FavoritePair {
  id: string;
  tokenA: string;
  tokenB: string;
  chainId: number;
  addedAt: Date;
}

export interface FavoriteAddress {
  address: string;
  label: string;
  chainId?: number;
  addedAt: Date;
}

const STORAGE_KEY_TOKENS = 'favorite_tokens';
const STORAGE_KEY_PAIRS = 'favorite_pairs';
const STORAGE_KEY_ADDRESSES = 'favorite_addresses';

export class FavoritesManager {
  private tokens: FavoriteToken[] = [];
  private pairs: FavoritePair[] = [];
  private addresses: FavoriteAddress[] = [];
  private storageManager: StorageManager;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.storageManager = new StorageManager();
    this.loadData();
  }

  /**
   * Load data from storage
   */
  private loadData(): void {
    try {
      const storedTokens = this.storageManager.get<FavoriteToken[]>(STORAGE_KEY_TOKENS);
      if (storedTokens && Array.isArray(storedTokens)) {
        this.tokens = storedTokens.map((token) => ({
          ...token,
          addedAt: new Date(token.addedAt),
        }));
      }

      const storedPairs = this.storageManager.get<FavoritePair[]>(STORAGE_KEY_PAIRS);
      if (storedPairs && Array.isArray(storedPairs)) {
        this.pairs = storedPairs.map((pair) => ({
          ...pair,
          addedAt: new Date(pair.addedAt),
        }));
      }

      const storedAddresses = this.storageManager.get<FavoriteAddress[]>(STORAGE_KEY_ADDRESSES);
      if (storedAddresses && Array.isArray(storedAddresses)) {
        this.addresses = storedAddresses.map((addr) => ({
          ...addr,
          addedAt: new Date(addr.addedAt),
        }));
      }
    } catch (error) {
      logger.error('Error loading favorites:', error);
    }
  }

  /**
   * Save data to storage
   */
  private saveData(): void {
    try {
      this.storageManager.set(STORAGE_KEY_TOKENS, this.tokens);
      this.storageManager.set(STORAGE_KEY_PAIRS, this.pairs);
      this.storageManager.set(STORAGE_KEY_ADDRESSES, this.addresses);
    } catch (error) {
      logger.error('Error saving favorites:', error);
    }
  }

  /**
   * Add token to favorites
   */
  addToken(address: string, symbol: string, name: string, chainId: number): void {
    // Check if already exists
    if (this.isTokenFavorite(address, chainId)) {
      return;
    }

    this.tokens.unshift({
      address: address.toLowerCase(),
      symbol,
      name,
      chainId,
      addedAt: new Date(),
    });

    this.saveData();
    this.notifyListeners();
  }

  /**
   * Remove token from favorites
   */
  removeToken(address: string, chainId: number): void {
    this.tokens = this.tokens.filter(
      (token) =>
        !(token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId)
    );

    this.saveData();
    this.notifyListeners();
  }

  /**
   * Check if token is favorite
   */
  isTokenFavorite(address: string, chainId: number): boolean {
    return this.tokens.some(
      (token) => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId
    );
  }

  /**
   * Get all favorite tokens
   */
  getFavoriteTokens(chainId?: number): FavoriteToken[] {
    if (chainId !== undefined) {
      return this.tokens.filter((token) => token.chainId === chainId);
    }
    return [...this.tokens];
  }

  /**
   * Add pair to favorites
   */
  addPair(tokenA: string, tokenB: string, chainId: number): void {
    const id = this.generatePairId(tokenA, tokenB, chainId);

    // Check if already exists
    if (this.pairs.some((pair) => pair.id === id)) {
      return;
    }

    this.pairs.unshift({
      id,
      tokenA: tokenA.toLowerCase(),
      tokenB: tokenB.toLowerCase(),
      chainId,
      addedAt: new Date(),
    });

    this.saveData();
    this.notifyListeners();
  }

  /**
   * Remove pair from favorites
   */
  removePair(tokenA: string, tokenB: string, chainId: number): void {
    const id = this.generatePairId(tokenA, tokenB, chainId);
    this.pairs = this.pairs.filter((pair) => pair.id !== id);

    this.saveData();
    this.notifyListeners();
  }

  /**
   * Check if pair is favorite
   */
  isPairFavorite(tokenA: string, tokenB: string, chainId: number): boolean {
    const id = this.generatePairId(tokenA, tokenB, chainId);
    return this.pairs.some((pair) => pair.id === id);
  }

  /**
   * Get all favorite pairs
   */
  getFavoritePairs(chainId?: number): FavoritePair[] {
    if (chainId !== undefined) {
      return this.pairs.filter((pair) => pair.chainId === chainId);
    }
    return [...this.pairs];
  }

  /**
   * Generate pair ID
   */
  private generatePairId(tokenA: string, tokenB: string, chainId: number): string {
    const [token0, token1] = [tokenA.toLowerCase(), tokenB.toLowerCase()].sort();
    return `${chainId}-${token0}-${token1}`;
  }

  /**
   * Add address to favorites
   */
  addAddress(address: string, label: string, chainId?: number): void {
    // Check if already exists
    if (this.isAddressFavorite(address, chainId)) {
      return;
    }

    this.addresses.unshift({
      address: address.toLowerCase(),
      label,
      chainId,
      addedAt: new Date(),
    });

    this.saveData();
    this.notifyListeners();
  }

  /**
   * Remove address from favorites
   */
  removeAddress(address: string, chainId?: number): void {
    this.addresses = this.addresses.filter(
      (addr) =>
        !(
          addr.address.toLowerCase() === address.toLowerCase() &&
          (chainId === undefined || addr.chainId === chainId)
        )
    );

    this.saveData();
    this.notifyListeners();
  }

  /**
   * Update address label
   */
  updateAddressLabel(address: string, label: string, chainId?: number): void {
    const addr = this.addresses.find(
      (a) =>
        a.address.toLowerCase() === address.toLowerCase() &&
        (chainId === undefined || a.chainId === chainId)
    );

    if (addr) {
      addr.label = label;
      this.saveData();
      this.notifyListeners();
    }
  }

  /**
   * Check if address is favorite
   */
  isAddressFavorite(address: string, chainId?: number): boolean {
    return this.addresses.some(
      (addr) =>
        addr.address.toLowerCase() === address.toLowerCase() &&
        (chainId === undefined || addr.chainId === chainId)
    );
  }

  /**
   * Get address label
   */
  getAddressLabel(address: string, chainId?: number): string | undefined {
    const addr = this.addresses.find(
      (a) =>
        a.address.toLowerCase() === address.toLowerCase() &&
        (chainId === undefined || a.chainId === chainId)
    );
    return addr?.label;
  }

  /**
   * Get all favorite addresses
   */
  getFavoriteAddresses(chainId?: number): FavoriteAddress[] {
    if (chainId !== undefined) {
      return this.addresses.filter((addr) => addr.chainId === chainId);
    }
    return [...this.addresses];
  }

  /**
   * Search favorite tokens
   */
  searchTokens(query: string, chainId?: number): FavoriteToken[] {
    const lowerQuery = query.toLowerCase();
    let tokens = this.tokens;

    if (chainId !== undefined) {
      tokens = tokens.filter((token) => token.chainId === chainId);
    }

    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search favorite addresses
   */
  searchAddresses(query: string, chainId?: number): FavoriteAddress[] {
    const lowerQuery = query.toLowerCase();
    let addresses = this.addresses;

    if (chainId !== undefined) {
      addresses = addresses.filter((addr) => addr.chainId === chainId);
    }

    return addresses.filter(
      (addr) =>
        addr.label.toLowerCase().includes(lowerQuery) ||
        addr.address.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get recent favorites
   */
  getRecentTokens(limit: number = 5, chainId?: number): FavoriteToken[] {
    let tokens = this.tokens;

    if (chainId !== undefined) {
      tokens = tokens.filter((token) => token.chainId === chainId);
    }

    return tokens.slice(0, limit);
  }

  /**
   * Get recent pairs
   */
  getRecentPairs(limit: number = 5, chainId?: number): FavoritePair[] {
    let pairs = this.pairs;

    if (chainId !== undefined) {
      pairs = pairs.filter((pair) => pair.chainId === chainId);
    }

    return pairs.slice(0, limit);
  }

  /**
   * Clear all favorites
   */
  clearAll(): void {
    this.tokens = [];
    this.pairs = [];
    this.addresses = [];
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Clear tokens
   */
  clearTokens(chainId?: number): void {
    if (chainId !== undefined) {
      this.tokens = this.tokens.filter((token) => token.chainId !== chainId);
    } else {
      this.tokens = [];
    }
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Clear pairs
   */
  clearPairs(chainId?: number): void {
    if (chainId !== undefined) {
      this.pairs = this.pairs.filter((pair) => pair.chainId !== chainId);
    } else {
      this.pairs = [];
    }
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Clear addresses
   */
  clearAddresses(chainId?: number): void {
    if (chainId !== undefined) {
      this.addresses = this.addresses.filter((addr) => addr.chainId !== chainId);
    } else {
      this.addresses = [];
    }
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalTokens: number;
    totalPairs: number;
    totalAddresses: number;
    byChain: Record<number, { tokens: number; pairs: number; addresses: number }>;
  } {
    const byChain: Record<number, { tokens: number; pairs: number; addresses: number }> = {};

    this.tokens.forEach((token) => {
      if (!byChain[token.chainId]) {
        byChain[token.chainId] = { tokens: 0, pairs: 0, addresses: 0 };
      }
      byChain[token.chainId].tokens++;
    });

    this.pairs.forEach((pair) => {
      if (!byChain[pair.chainId]) {
        byChain[pair.chainId] = { tokens: 0, pairs: 0, addresses: 0 };
      }
      byChain[pair.chainId].pairs++;
    });

    this.addresses.forEach((addr) => {
      if (addr.chainId !== undefined) {
        if (!byChain[addr.chainId]) {
          byChain[addr.chainId] = { tokens: 0, pairs: 0, addresses: 0 };
        }
        byChain[addr.chainId].addresses++;
      }
    });

    return {
      totalTokens: this.tokens.length,
      totalPairs: this.pairs.length,
      totalAddresses: this.addresses.length,
      byChain,
    };
  }

  /**
   * Export favorites
   */
  export(): {
    tokens: FavoriteToken[];
    pairs: FavoritePair[];
    addresses: FavoriteAddress[];
  } {
    return {
      tokens: this.tokens,
      pairs: this.pairs,
      addresses: this.addresses,
    };
  }

  /**
   * Import favorites
   */
  import(data: {
    tokens?: FavoriteToken[];
    pairs?: FavoritePair[];
    addresses?: FavoriteAddress[];
  }): void {
    try {
      if (data.tokens && Array.isArray(data.tokens)) {
        this.tokens = data.tokens.map((token) => ({
          ...token,
          addedAt: new Date(token.addedAt),
        }));
      }

      if (data.pairs && Array.isArray(data.pairs)) {
        this.pairs = data.pairs.map((pair) => ({
          ...pair,
          addedAt: new Date(pair.addedAt),
        }));
      }

      if (data.addresses && Array.isArray(data.addresses)) {
        this.addresses = data.addresses.map((addr) => ({
          ...addr,
          addedAt: new Date(addr.addedAt),
        }));
      }

      this.saveData();
      this.notifyListeners();
    } catch (error) {
      logger.error('Error importing favorites:', error);
      throw new Error('Failed to import favorites');
    }
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
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
}

// Singleton instance
export const favoritesManager = new FavoritesManager();
