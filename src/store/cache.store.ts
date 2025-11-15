/**
 * Cache state management store
 * @module store
 */

import { create } from 'zustand';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheState {
  cache: Map<string, CacheEntry>;
  set: <T>(key: string, data: T, ttl?: number) => void;
  get: <T>(key: string) => T | null;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  clear: () => void;
  prune: () => void;
}

export const useCacheStore = create<CacheState>((set, get) => ({
  cache: new Map(),
  set: (key, data, ttl = 300000) => {
    const now = Date.now();
    set((state) => {
      const newCache = new Map(state.cache);
      newCache.set(key, {
        data,
        timestamp: now,
        expiresAt: now + ttl,
      });
      return { cache: newCache };
    });
  },
  get: (key) => {
    const entry = get().cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      get().delete(key);
      return null;
    }

    return entry.data as typeof entry.data;
  },
  has: (key) => {
    const entry = get().cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      get().delete(key);
      return false;
    }

    return true;
  },
  delete: (key) => {
    set((state) => {
      const newCache = new Map(state.cache);
      newCache.delete(key);
      return { cache: newCache };
    });
  },
  clear: () => set({ cache: new Map() }),
  prune: () => {
    const now = Date.now();
    set((state) => {
      const newCache = new Map(state.cache);
      for (const [key, entry] of newCache.entries()) {
        if (now > entry.expiresAt) {
          newCache.delete(key);
        }
      }
      return { cache: newCache };
    });
  },
}));
