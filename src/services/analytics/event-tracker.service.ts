/**
 * Event tracking service for analytics
 * @module services/analytics
 */

type EventProperties = Record<string, unknown>;

class EventTrackerService {
  private queue: Array<{ event: string; properties: EventProperties; timestamp: number }> = [];

  track(event: string, properties: EventProperties = {}): void {
    this.queue.push({
      event,
      properties,
      timestamp: Date.now(),
    });

    // In production, send to analytics service
    console.log('[Analytics]', event, properties);
  }

  trackPageView(path: string): void {
    this.track('page_view', { path });
  }

  trackSwap(params: { fromToken: string; toToken: string; amount: string }): void {
    this.track('swap_executed', params);
  }

  trackWalletConnect(address: string): void {
    this.track('wallet_connected', { address: address.slice(0, 10) });
  }

  flush(): void {
    this.queue = [];
  }
}

export const eventTracker = new EventTrackerService();
