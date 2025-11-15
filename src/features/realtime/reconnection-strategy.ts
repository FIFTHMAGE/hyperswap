/**
 * Reconnection strategies for WebSocket
 */

export interface ReconnectionStrategy {
  shouldReconnect(attempt: number): boolean;
  getDelay(attempt: number): number;
}

export class ExponentialBackoff implements ReconnectionStrategy {
  constructor(
    private baseDelay: number = 1000,
    private maxDelay: number = 30000,
    private maxAttempts: number = 5
  ) {}

  shouldReconnect(attempt: number): boolean {
    return attempt < this.maxAttempts;
  }

  getDelay(attempt: number): number {
    const delay = Math.min(
      this.baseDelay * Math.pow(2, attempt),
      this.maxDelay
    );
    return delay + Math.random() * 1000; // Add jitter
  }
}

export class FixedInterval implements ReconnectionStrategy {
  constructor(
    private interval: number = 5000,
    private maxAttempts: number = 10
  ) {}

  shouldReconnect(attempt: number): boolean {
    return attempt < this.maxAttempts;
  }

  getDelay(): number {
    return this.interval;
  }
}

