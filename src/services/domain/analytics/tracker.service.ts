/**
 * Analytics event tracking service
 * @module services/analytics/tracker
 */

import { isDevelopment } from '@/config/env';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
  timestamp?: number;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean;

  constructor() {
    this.enabled = !isDevelopment();
  }

  /**
   * Track an event
   */
  track(event: AnalyticsEvent): void {
    if (!this.enabled) {
      console.log('[Analytics]', event);
      return;
    }

    this.events.push({
      ...event,
      timestamp: Date.now(),
    });

    // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    this.track({
      category: 'Navigation',
      action: 'Page View',
      label: path,
      metadata: { title },
    });
  }

  /**
   * Track swap
   */
  trackSwap(params: {
    fromToken: string;
    toToken: string;
    amount: string;
    chainId: number;
  }): void {
    this.track({
      category: 'Swap',
      action: 'Execute',
      metadata: params,
    });
  }

  /**
   * Track wallet connection
   */
  trackWalletConnect(address: string, chainId: number): void {
    this.track({
      category: 'Wallet',
      action: 'Connect',
      metadata: { address, chainId },
    });
  }

  /**
   * Track error
   */
  trackError(error: string, context?: Record<string, any>): void {
    this.track({
      category: 'Error',
      action: error,
      metadata: context,
    });
  }

  /**
   * Get tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const analyticsTracker = new AnalyticsTracker();

