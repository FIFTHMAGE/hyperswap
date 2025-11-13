/**
 * Real-time data streaming utilities
 */

export class DataStream<T> {
  private subscribers: Set<(data: T) => void> = new Set();
  private buffer: T[] = [];
  private maxBufferSize: number;

  constructor(maxBufferSize: number = 100) {
    this.maxBufferSize = maxBufferSize;
  }

  push(data: T): void {
    this.buffer.push(data);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    this.subscribers.forEach((callback) => callback(data));
  }

  subscribe(callback: (data: T) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getBuffer(): T[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }
}

export const priceStream = new DataStream<any>(1000);
export const tradeStream = new DataStream<any>(500);
export const orderBookStream = new DataStream<any>(100);

