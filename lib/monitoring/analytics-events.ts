export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
};

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];

  track(name: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Send to analytics provider
    this.sendToAnalytics(event);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // Placeholder for analytics providers (GA, Mixpanel, etc.)
    // Example: gtag('event', event.name, event.properties);
  }

  // Predefined event trackers
  trackPageView(page: string): void {
    this.track('page_view', { page });
  }

  trackWalletConnect(address: string): void {
    this.track('wallet_connect', { address });
  }

  trackWrappedGenerated(address: string): void {
    this.track('wrapped_generated', { address });
  }

  trackCardView(cardName: string): void {
    this.track('card_view', { cardName });
  }

  trackShare(platform: string): void {
    this.track('share', { platform });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}

export const analyticsTracker = new AnalyticsTracker();

