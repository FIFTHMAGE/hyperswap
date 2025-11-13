export async function registerBackgroundSync(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    return true;
  } catch (error) {
    console.error('Background sync registration failed:', error);
    return false;
  }
}

export async function getTags(): Promise<string[]> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    return [];
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.sync.getTags();
  } catch (error) {
    console.error('Failed to get sync tags:', error);
    return [];
  }
}

// Queue for offline actions
interface QueuedAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

class ActionQueue {
  private queue: QueuedAction[] = [];
  private storageKey = 'pwa-action-queue';

  constructor() {
    this.loadQueue();
  }

  add(type: string, data: any): string {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
    };

    this.queue.push(action);
    this.saveQueue();
    registerBackgroundSync('sync-wallet-data');
    
    return action.id;
  }

  remove(id: string): boolean {
    const index = this.queue.findIndex(a => a.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.saveQueue();
      return true;
    }
    return false;
  }

  getAll(): QueuedAction[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
    this.saveQueue();
  }

  private loadQueue(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load action queue:', error);
    }
  }

  private saveQueue(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save action queue:', error);
    }
  }
}

export const actionQueue = new ActionQueue();

