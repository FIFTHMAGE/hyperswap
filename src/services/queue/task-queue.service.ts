/**
 * Task queue service for async operations
 * @module services/queue
 */

interface Task<T> {
  id: string;
  fn: () => Promise<T>;
  priority: number;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

class TaskQueueService {
  private queue: Task<unknown>[] = [];
  private running = false;
  private concurrency = 3;
  private activeCount = 0;

  /**
   * Add task to queue
   */
  async add<T>(fn: () => Promise<T>, options: { priority?: number; id?: string } = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: Task<T> = {
        id: options.id || Math.random().toString(36),
        fn: fn as () => Promise<unknown>,
        priority: options.priority || 0,
        resolve: resolve as (value: unknown) => void,
        reject,
      };

      this.queue.push(task);
      this.queue.sort((a, b) => b.priority - a.priority);

      if (!this.running) {
        this.start();
      }
    });
  }

  /**
   * Start processing queue
   */
  private async start(): Promise<void> {
    this.running = true;

    while (this.queue.length > 0 || this.activeCount > 0) {
      while (this.activeCount < this.concurrency && this.queue.length > 0) {
        const task = this.queue.shift();
        if (task) {
          this.processTask(task);
        }
      }

      if (this.queue.length === 0 && this.activeCount === 0) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    this.running = false;
  }

  /**
   * Process single task
   */
  private async processTask(task: Task<unknown>): Promise<void> {
    this.activeCount++;

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      task.reject(error as Error);
    } finally {
      this.activeCount--;
    }
  }

  /**
   * Set concurrency limit
   */
  setConcurrency(limit: number): void {
    this.concurrency = Math.max(1, limit);
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }
}

export const taskQueue = new TaskQueueService();
