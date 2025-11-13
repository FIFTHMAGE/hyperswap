export type StreamEventType = 'price-update' | 'new-transaction' | 'balance-change' | 'alert';

export interface StreamEvent {
  type: StreamEventType;
  timestamp: string;
  data: any;
}

export class DataStream {
  private subscribers: Map<string, Set<(event: StreamEvent) => void>> = new Map();
  private eventBuffer: StreamEvent[] = [];
  private maxBufferSize = 100;

  subscribe(eventType: StreamEventType, callback: (event: StreamEvent) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  emit(event: StreamEvent): void {
    // Add to buffer
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.shift();
    }

    // Notify subscribers
    const subscribers = this.subscribers.get(event.type);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Stream subscriber error:', error);
        }
      });
    }
  }

  getRecentEvents(eventType?: StreamEventType, limit: number = 10): StreamEvent[] {
    const events = eventType 
      ? this.eventBuffer.filter(e => e.type === eventType)
      : this.eventBuffer;
    
    return events.slice(-limit);
  }

  clearBuffer(): void {
    this.eventBuffer = [];
  }

  getSubscriberCount(eventType: StreamEventType): number {
    return this.subscribers.get(eventType)?.size || 0;
  }
}

// Singleton instance
export const dataStream = new DataStream();

