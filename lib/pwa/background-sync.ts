/**
 * Background Sync
 * Queue and sync data when connection is restored
 */

export interface SyncTask {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export class BackgroundSyncManager {
  private tasks: Map<string, SyncTask> = new Map();
  private isProcessing = false;
  private readonly STORAGE_KEY = 'bg-sync-tasks';

  constructor() {
    this.loadTasks();
    this.setupListeners();
  }

  /**
   * Register a sync task
   */
  async register(tag: string, data: any, maxRetries: number = 3): Promise<string> {
    const id = `${tag}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const task: SyncTask = {
      id,
      type: tag,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries,
    };

    this.tasks.set(id, task);
    this.saveTasks();

    // Register with Background Sync API if available
    if ('sync' in registration) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await (reg as any).sync.register(tag);
      } catch (error) {
        console.warn('Background Sync API not available, will use fallback');
      }
    }

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processTasks();
    }

    return id;
  }

  /**
   * Process all pending tasks
   */
  private async processTasks(): Promise<void> {
    if (this.isProcessing || !navigator.onLine) return;

    this.isProcessing = true;

    for (const [id, task] of this.tasks.entries()) {
      try {
        await this.processTask(task);
        this.tasks.delete(id);
      } catch (error) {
        console.error(`Task ${id} failed:`, error);
        task.retries++;
        
        if (task.retries >= task.maxRetries) {
          console.error(`Task ${id} exceeded max retries, removing`);
          this.tasks.delete(id);
        }
      }
    }

    this.saveTasks();
    this.isProcessing = false;
  }

  /**
   * Process individual task
   */
  private async processTask(task: SyncTask): Promise<void> {
    // Dispatch custom event for handlers
    const event = new CustomEvent('backgroundsync', {
      detail: task,
    });
    window.dispatchEvent(event);

    // Default handler - make API request
    if (task.data.url) {
      const response = await fetch(task.data.url, {
        method: task.data.method || 'POST',
        headers: task.data.headers || {},
        body: JSON.stringify(task.data.body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    }
  }

  /**
   * Setup listeners
   */
  private setupListeners(): void {
    // Process when coming online
    window.addEventListener('online', () => {
      this.processTasks();
    });

    // Listen for service worker sync events
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        const taskId = event.data.taskId;
        this.tasks.delete(taskId);
        this.saveTasks();
      }
    });
  }

  /**
   * Load tasks from storage
   */
  private loadTasks(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const tasks = JSON.parse(stored);
        this.tasks = new Map(tasks);
      }
    } catch (error) {
      console.error('Failed to load background sync tasks:', error);
    }
  }

  /**
   * Save tasks to storage
   */
  private saveTasks(): void {
    try {
      const tasks = Array.from(this.tasks.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save background sync tasks:', error);
    }
  }

  /**
   * Get pending tasks count
   */
  getPendingCount(): number {
    return this.tasks.size;
  }

  /**
   * Get all tasks
   */
  getTasks(): SyncTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Clear all tasks
   */
  clearAll(): void {
    this.tasks.clear();
    this.saveTasks();
  }
}

// Singleton
let bgSyncManager: BackgroundSyncManager | null = null;

export function getBackgroundSyncManager(): BackgroundSyncManager {
  if (!bgSyncManager && typeof window !== 'undefined') {
    bgSyncManager = new BackgroundSyncManager();
  }
  return bgSyncManager!;
}
