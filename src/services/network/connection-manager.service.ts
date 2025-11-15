/**
 * Network connection manager
 * @module services/network
 */

type ConnectionStatus = 'online' | 'offline' | 'slow';
type ConnectionListener = (status: ConnectionStatus) => void;

class ConnectionManagerService {
  private status: ConnectionStatus = 'online';
  private listeners = new Set<ConnectionListener>();

  constructor() {
    this.initialize();
  }

  /**
   * Initialize connection monitoring
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => this.setStatus('online'));
    window.addEventListener('offline', () => this.setStatus('offline'));

    // Check initial status
    this.updateStatus();
  }

  /**
   * Update connection status
   */
  private updateStatus(): void {
    if (!navigator.onLine) {
      this.setStatus('offline');
      return;
    }

    // Check connection quality
    this.checkConnectionQuality();
  }

  /**
   * Check connection quality
   */
  private async checkConnectionQuality(): Promise<void> {
    try {
      const start = performance.now();
      await fetch('/api/health', { method: 'HEAD', cache: 'no-cache' });
      const duration = performance.now() - start;

      if (duration > 3000) {
        this.setStatus('slow');
      } else {
        this.setStatus('online');
      }
    } catch {
      this.setStatus('offline');
    }
  }

  /**
   * Set connection status
   */
  private setStatus(status: ConnectionStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.notifyListeners();
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.status));
  }

  /**
   * Subscribe to connection changes
   */
  subscribe(listener: ConnectionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current status
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return this.status !== 'offline';
  }
}

export const connectionManager = new ConnectionManagerService();
