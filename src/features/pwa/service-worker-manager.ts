/**
 * Service Worker Manager
 * Manages service worker registration and updates
 */

export interface ServiceWorkerConfig {
  updateCheckInterval: number; // ms
  skipWaiting: boolean;
  autoUpdate: boolean;
}

const DEFAULT_CONFIG: ServiceWorkerConfig = {
  updateCheckInterval: 60000, // 1 minute
  skipWaiting: true,
  autoUpdate: false,
};

export class ServiceWorkerManager {
  private config: ServiceWorkerConfig;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  constructor(config: Partial<ServiceWorkerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Register service worker
   */
  async register(scriptUrl: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(scriptUrl);
      console.log('Service Worker registered:', this.registration);

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          this.handleNewWorker(newWorker);
        }
      });

      // Start update checks
      if (this.config.updateCheckInterval > 0) {
        this.startUpdateChecks();
      }

      this.emit('registered', this.registration);
      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Handle new service worker
   */
  private handleNewWorker(worker: ServiceWorker): void {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        // New version available
        this.emit('updateAvailable', worker);

        if (this.config.autoUpdate && this.config.skipWaiting) {
          this.skipWaiting();
        }
      }

      if (worker.state === 'activated') {
        this.emit('updateInstalled', worker);
      }
    });
  }

  /**
   * Skip waiting and activate new service worker
   */
  skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      this.emit('skippingWaiting');
    }
  }

  /**
   * Check for updates
   */
  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('Checked for service worker updates');
      } catch (error) {
        console.error('Update check failed:', error);
      }
    }
  }

  /**
   * Start periodic update checks
   */
  private startUpdateChecks(): void {
    this.updateCheckTimer = setInterval(() => {
      this.checkForUpdates();
    }, this.config.updateCheckInterval);
  }

  /**
   * Stop update checks
   */
  private stopUpdateChecks(): void {
    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer);
      this.updateCheckTimer = null;
    }
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<boolean> {
    if (this.registration) {
      const success = await this.registration.unregister();
      if (success) {
        this.registration = null;
        this.stopUpdateChecks();
        this.emit('unregistered');
      }
      return success;
    }
    return false;
  }

  /**
   * Post message to service worker
   */
  postMessage(message: any): void {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
  }

  /**
   * Listen for messages from service worker
   */
  onMessage(callback: (event: MessageEvent) => void): () => void {
    navigator.serviceWorker.addEventListener('message', callback);
    return () => navigator.serviceWorker.removeEventListener('message', callback);
  }

  /**
   * Event emitter
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => this.off(event, callback);
  }

  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, ...args: any[]): void {
    this.listeners.get(event)?.forEach(callback => callback(...args));
  }

  /**
   * Get service worker state
   */
  getState(): {
    isSupported: boolean;
    isRegistered: boolean;
    isControlling: boolean;
    updateAvailable: boolean;
  } {
    return {
      isSupported: 'serviceWorker' in navigator,
      isRegistered: this.registration !== null,
      isControlling: navigator.serviceWorker?.controller !== null,
      updateAvailable: this.registration?.waiting !== null,
    };
  }
}

// Singleton
let swManager: ServiceWorkerManager | null = null;

export function getServiceWorkerManager(config?: Partial<ServiceWorkerConfig>): ServiceWorkerManager {
  if (!swManager && typeof window !== 'undefined') {
    swManager = new ServiceWorkerManager(config);
  }
  return swManager!;
}

