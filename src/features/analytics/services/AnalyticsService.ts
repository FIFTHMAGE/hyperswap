/**
 * AnalyticsService - Track and analyze user behavior and transactions
 * @module features/analytics/services
 */

export enum EventType {
  PAGE_VIEW = 'page_view',
  SWAP_INITIATED = 'swap_initiated',
  SWAP_COMPLETED = 'swap_completed',
  SWAP_FAILED = 'swap_failed',
  LIQUIDITY_ADDED = 'liquidity_added',
  LIQUIDITY_REMOVED = 'liquidity_removed',
  WALLET_CONNECTED = 'wallet_connected',
  WALLET_DISCONNECTED = 'wallet_disconnected',
  TOKEN_SELECTED = 'token_selected',
  SETTINGS_CHANGED = 'settings_changed',
  ERROR_OCCURRED = 'error_occurred',
}

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: number;
  userId?: string;
  sessionId: string;
  properties: Record<string, any>;
  metadata: {
    userAgent: string;
    screen: { width: number; height: number };
    referrer?: string;
    url: string;
  };
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  events: AnalyticsEvent[];
  userId?: string;
}

export interface SwapMetrics {
  totalSwaps: number;
  successfulSwaps: number;
  failedSwaps: number;
  totalVolume: number;
  averageSwapSize: number;
  mostTradedPairs: Array<{ pair: string; count: number; volume: number }>;
  successRate: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessions: Map<string, UserSession> = new Map();
  private currentSessionId: string;

  constructor() {
    this.currentSessionId = this.generateSessionId();
    this.initializeSession();
  }

  /**
   * Track an event
   */
  track(type: EventType, properties: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      timestamp: Date.now(),
      sessionId: this.currentSessionId,
      properties,
      metadata: this.getMetadata(),
    };

    this.events.push(event);
    this.addEventToSession(event);

    // Send to analytics backend
    this.sendToBackend(event);

    console.log('Analytics event tracked:', type, properties);
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    this.track(EventType.PAGE_VIEW, {
      path,
      title: title || document.title,
    });
  }

  /**
   * Track swap
   */
  trackSwap(swap: {
    fromToken: string;
    toToken: string;
    amount: string;
    status: 'initiated' | 'completed' | 'failed';
    txHash?: string;
    error?: string;
  }): void {
    const eventType =
      swap.status === 'initiated'
        ? EventType.SWAP_INITIATED
        : swap.status === 'completed'
          ? EventType.SWAP_COMPLETED
          : EventType.SWAP_FAILED;

    this.track(eventType, {
      fromToken: swap.fromToken,
      toToken: swap.toToken,
      amount: swap.amount,
      txHash: swap.txHash,
      error: swap.error,
    });
  }

  /**
   * Track liquidity operation
   */
  trackLiquidity(operation: {
    type: 'add' | 'remove';
    token0: string;
    token1: string;
    amount0: string;
    amount1: string;
    txHash?: string;
  }): void {
    const eventType =
      operation.type === 'add' ? EventType.LIQUIDITY_ADDED : EventType.LIQUIDITY_REMOVED;

    this.track(eventType, {
      token0: operation.token0,
      token1: operation.token1,
      amount0: operation.amount0,
      amount1: operation.amount1,
      txHash: operation.txHash,
    });
  }

  /**
   * Track wallet connection
   */
  trackWalletConnection(connected: boolean, address?: string): void {
    this.track(connected ? EventType.WALLET_CONNECTED : EventType.WALLET_DISCONNECTED, { address });
  }

  /**
   * Track error
   */
  trackError(error: {
    message: string;
    stack?: string;
    component?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): void {
    this.track(EventType.ERROR_OCCURRED, error);
  }

  /**
   * Get swap metrics
   */
  getSwapMetrics(timeRange?: { start: number; end: number }): SwapMetrics {
    const swapEvents = this.getFilteredEvents(
      [EventType.SWAP_INITIATED, EventType.SWAP_COMPLETED, EventType.SWAP_FAILED],
      timeRange
    );

    const totalSwaps = swapEvents.filter((e) => e.type === EventType.SWAP_INITIATED).length;
    const successfulSwaps = swapEvents.filter((e) => e.type === EventType.SWAP_COMPLETED).length;
    const failedSwaps = swapEvents.filter((e) => e.type === EventType.SWAP_FAILED).length;

    // Calculate volume
    let totalVolume = 0;
    const pairCounts: Map<string, { count: number; volume: number }> = new Map();

    for (const event of swapEvents) {
      const amount = parseFloat(event.properties.amount || '0');
      totalVolume += amount;

      const pair = `${event.properties.fromToken}-${event.properties.toToken}`;
      const existing = pairCounts.get(pair) || { count: 0, volume: 0 };
      pairCounts.set(pair, {
        count: existing.count + 1,
        volume: existing.volume + amount,
      });
    }

    const mostTradedPairs = Array.from(pairCounts.entries())
      .map(([pair, data]) => ({ pair, ...data }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    return {
      totalSwaps,
      successfulSwaps,
      failedSwaps,
      totalVolume,
      averageSwapSize: totalSwaps > 0 ? totalVolume / totalSwaps : 0,
      mostTradedPairs,
      successRate: totalSwaps > 0 ? (successfulSwaps / totalSwaps) * 100 : 0,
    };
  }

  /**
   * Get user metrics
   */
  getUserMetrics(timeRange?: { start: number; end: number }): UserMetrics {
    const sessions = Array.from(this.sessions.values()).filter((session) => {
      if (!timeRange) return true;
      return session.startTime >= timeRange.start && session.startTime <= timeRange.end;
    });

    const uniqueUsers = new Set(sessions.map((s) => s.userId).filter(Boolean));
    const totalSessions = sessions.length;

    // Calculate bounce rate (sessions with only 1 event)
    const bouncedSessions = sessions.filter((s) => s.events.length <= 1).length;
    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    // Calculate average session duration
    const totalDuration = sessions
      .filter((s) => s.duration)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    return {
      totalUsers: uniqueUsers.size,
      activeUsers: uniqueUsers.size,
      newUsers: 0, // Would need historical data
      returningUsers: 0, // Would need historical data
      averageSessionDuration,
      bounceRate,
    };
  }

  /**
   * Get event funnel
   */
  getFunnel(steps: EventType[]): Array<{ step: EventType; count: number; dropoff: number }> {
    const result: Array<{ step: EventType; count: number; dropoff: number }> = [];
    let previousCount = 0;

    for (const step of steps) {
      const count = this.events.filter((e) => e.type === step).length;
      const dropoff = previousCount > 0 ? ((previousCount - count) / previousCount) * 100 : 0;

      result.push({ step, count, dropoff });
      previousCount = count;
    }

    return result;
  }

  /**
   * Get event timeline
   */
  getTimeline(
    eventTypes: EventType[],
    interval: 'hour' | 'day' | 'week'
  ): Array<{ timestamp: number; count: number; events: Record<EventType, number> }> {
    const intervalMs = this.getIntervalMs(interval);
    const grouped = new Map<number, { count: number; events: Record<EventType, number> }>();

    const filteredEvents = this.events.filter((e) => eventTypes.includes(e.type));

    for (const event of filteredEvents) {
      const bucket = Math.floor(event.timestamp / intervalMs) * intervalMs;
      const existing = grouped.get(bucket) || {
        count: 0,
        events: {} as Record<EventType, number>,
      };

      existing.count++;
      existing.events[event.type] = (existing.events[event.type] || 0) + 1;

      grouped.set(bucket, existing);
    }

    return Array.from(grouped.entries())
      .map(([timestamp, data]) => ({ timestamp, ...data }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get user journey
   */
  getUserJourney(sessionId: string): AnalyticsEvent[] {
    const session = this.sessions.get(sessionId);
    return session ? session.events : [];
  }

  /**
   * End current session
   */
  endSession(): void {
    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
    }
  }

  /**
   * Start new session
   */
  startNewSession(): void {
    this.endSession();
    this.currentSessionId = this.generateSessionId();
    this.initializeSession();
  }

  /**
   * Initialize session
   */
  private initializeSession(): void {
    const session: UserSession = {
      id: this.currentSessionId,
      startTime: Date.now(),
      events: [],
    };
    this.sessions.set(this.currentSessionId, session);
  }

  /**
   * Add event to current session
   */
  private addEventToSession(event: AnalyticsEvent): void {
    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      session.events.push(event);
    }
  }

  /**
   * Get filtered events
   */
  private getFilteredEvents(
    types: EventType[],
    timeRange?: { start: number; end: number }
  ): AnalyticsEvent[] {
    return this.events.filter((event) => {
      if (!types.includes(event.type)) return false;
      if (!timeRange) return true;
      return event.timestamp >= timeRange.start && event.timestamp <= timeRange.end;
    });
  }

  /**
   * Get metadata
   */
  private getMetadata(): AnalyticsEvent['metadata'] {
    return {
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      referrer: document.referrer,
      url: window.location.href,
    };
  }

  /**
   * Send event to backend
   */
  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    // Mock implementation - would send to analytics backend
    // In production, this would batch events and send periodically
    console.debug('Sending analytics event to backend:', event);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get interval in milliseconds
   */
  private getIntervalMs(interval: 'hour' | 'day' | 'week'): number {
    const intervals = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    };
    return intervals[interval];
  }

  /**
   * Export analytics data
   */
  export(): { events: AnalyticsEvent[]; sessions: UserSession[] } {
    return {
      events: this.events,
      sessions: Array.from(this.sessions.values()),
    };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.events = [];
    this.sessions.clear();
    this.startNewSession();
  }
}

export const analyticsService = new AnalyticsService();
