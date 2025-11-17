type PendingRequest<T> = {
  promise: Promise<T>;
  timestamp: number;
};

export class RequestDeduplicator {
  private pending: Map<string, PendingRequest<any>> = new Map();
  private timeout: number = 30000; // 30 seconds

  async deduplicate<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Check if there's a pending request
    const existing = this.pending.get(key);
    if (existing) {
      const age = Date.now() - existing.timestamp;
      if (age < this.timeout) {
        return existing.promise;
      } else {
        // Timeout expired, remove stale request
        this.pending.delete(key);
      }
    }

    // Create new request
    const promise = fetcher().finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  clear(): void {
    this.pending.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();
