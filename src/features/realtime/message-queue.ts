/**
 * Message queue for handling WebSocket messages
 */

interface QueuedMessage {
  id: string;
  data: any;
  timestamp: number;
  retries: number;
}

export class MessageQueue {
  private queue: QueuedMessage[] = [];
  private processing = false;
  private maxRetries = 3;

  enqueue(data: any): string {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.queue.push({
      id,
      data,
      timestamp: Date.now(),
      retries: 0,
    });
    this.process();
    return id;
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue[0];

      try {
        await this.sendMessage(message);
        this.queue.shift();
      } catch (error) {
        message.retries++;
        if (message.retries >= this.maxRetries) {
          console.error('Message failed after max retries:', message);
          this.queue.shift();
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * message.retries));
        }
      }
    }

    this.processing = false;
  }

  private async sendMessage(message: QueuedMessage): Promise<void> {
    // Actual sending logic would go here
    return Promise.resolve();
  }

  clear(): void {
    this.queue = [];
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export const messageQueue = new MessageQueue();

