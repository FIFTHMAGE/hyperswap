/**
 * Offline Manager
 * Manages offline functionality and cache strategies
 */

export interface CacheStrategy {
  name: string;
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate';
  maxAge?: number; // Max cache age in seconds
  maxEntries?: number; // Max cache entries
}

export interface OfflineConfig {
  enableCache: boolean;
  cacheStrategies: CacheStrategy[];
  offlinePageUrl: string;
  syncInterval: number; // Background sync interval (ms)
}

const DEFAULT_CONFIG: OfflineConfig = {
  enableCache: true,
  cacheStrategies: [
    {
      name: 'images',
      pattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
      strategy: 'cache-first',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      maxEntries: 100,
    },
    {
      name: 'api',
      pattern: /\/api\//,
      strategy: 'network-first',
      maxAge: 5 * 60, // 5 minutes
      maxEntries: 50,
    },
    {
      name: 'static',
      pattern: /\.(css|js)$/,
      strategy: 'cache-first',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      maxEntries: 50,
    },
  ],
  offlinePageUrl: '/offline.html',
  syncInterval: 60000, // 1 minute
};

export class OfflineManager {
  private config: OfflineConfig;
  private isOnline: boolean = navigator.onLine;
  private syncTimer: NodeJS.Timeout | null = null;
  private pendingRequests: Map<string, Request> = new Map();
  private listeners: Set<(isOnline: boolean) => void> = new Set();

  constructor(config: Partial<OfflineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }

  /**
   * Initialize offline manager
   */
  private initialize(): void {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Register service worker
    if ('serviceWorker' in navigator && this.config.enableCache) {
      this.registerServiceWorker();
    }

    // Start background sync
    if (this.isOnline) {
      this.startBackgroundSync();
    }
  }

  /**
   * Register service worker
   */
  private async registerServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Send config to service worker
      if (registration.active) {
        registration.active.postMessage({
          type: 'CONFIG',
          config: this.config,
        });
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('App is online');
    this.isOnline = true;
    this.notifyListeners(true);
    this.startBackgroundSync();
    this.processPendingRequests();
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('App is offline');
    this.isOnline = false;
    this.notifyListeners(false);
    this.stopBackgroundSync();
  }

  /**
   * Check if online
   */
  isOnlineNow(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to online/offline changes
   */
  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isOnline); // Initial call

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(listener => listener(isOnline));
  }

  /**
   * Queue request for later processing when online
   */
  queueRequest(request: Request): void {
    const key = `${request.method}-${request.url}-${Date.now()}`;
    this.pendingRequests.set(key, request.clone());
    console.log(`Queued request: ${key}`);
  }

  /**
   * Process pending requests when back online
   */
  private async processPendingRequests(): Promise<void> {
    if (this.pendingRequests.size === 0) return;

    console.log(`Processing ${this.pendingRequests.size} pending requests`);

    for (const [key, request] of this.pendingRequests.entries()) {
      try {
        await fetch(request);
        this.pendingRequests.delete(key);
        console.log(`Successfully processed: ${key}`);
      } catch (error) {
        console.error(`Failed to process: ${key}`, error);
      }
    }
  }

  /**
   * Start background sync
   */
  private startBackgroundSync(): void {
    if (this.syncTimer) return;

    this.syncTimer = setInterval(() => {
      this.processPendingRequests();
    }, this.config.syncInterval);
  }

  /**
   * Stop background sync
   */
  private stopBackgroundSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Get cache strategy for a URL
   */
  getCacheStrategy(url: string): CacheStrategy | null {
    for (const strategy of this.config.cacheStrategies) {
      if (strategy.pattern.test(url)) {
        return strategy;
      }
    }
    return null;
  }

  /**
   * Cache a response
   */
  async cacheResponse(request: Request, response: Response): Promise<void> {
    const strategy = this.getCacheStrategy(request.url);
    if (!strategy) return;

    try {
      const cache = await caches.open(strategy.name);
      await cache.put(request, response.clone());
      
      // Enforce max entries
      if (strategy.maxEntries) {
        const keys = await cache.keys();
        if (keys.length > strategy.maxEntries) {
          await cache.delete(keys[0]);
        }
      }
    } catch (error) {
      console.error('Failed to cache response:', error);
    }
  }

  /**
   * Get cached response
   */
  async getCachedResponse(request: Request): Promise<Response | undefined> {
    const strategy = this.getCacheStrategy(request.url);
    if (!strategy) return undefined;

    try {
      const cache = await caches.open(strategy.name);
      const response = await cache.match(request);
      
      if (response && strategy.maxAge) {
        const cachedDate = response.headers.get('date');
        if (cachedDate) {
          const age = (Date.now() - new Date(cachedDate).getTime()) / 1000;
          if (age > strategy.maxAge) {
            await cache.delete(request);
            return undefined;
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return undefined;
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    );
    console.log('All caches cleared');
  }

  /**
   * Get cache size
   */
  async getCacheSize(): Promise<number> {
    let totalSize = 0;
    
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};
    const cacheNames = await caches.keys();
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      stats[name] = {
        entries: keys.length,
        urls: keys.map(k => k.url),
      };
    }
    
    return stats;
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    this.stopBackgroundSync();
    this.listeners.clear();
    this.pendingRequests.clear();
  }
}

// Singleton instance
let offlineManager: OfflineManager | null = null;

export function getOfflineManager(config?: Partial<OfflineConfig>): OfflineManager {
  if (!offlineManager && typeof window !== 'undefined') {
    offlineManager = new OfflineManager(config);
  }
  return offlineManager!;
}

/**
 * React hook for offline status
 */
export function useOfflineStatus() {
  if (typeof window === 'undefined') {
    return { isOnline: true, isOffline: false };
  }

  const manager = getOfflineManager();
  const [isOnline, setIsOnline] = React.useState(manager.isOnlineNow());

  React.useEffect(() => {
    return manager.subscribe(setIsOnline);
  }, [manager]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}

// Import React for the hook
import * as React from 'react';

