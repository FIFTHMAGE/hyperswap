/**
 * Subscription manager for real-time data
 * @module services/realtime/subscription-manager
 */

type SubscriptionCallback = (data: any) => void;

interface Subscription {
  id: string;
  topic: string;
  callback: SubscriptionCallback;
}

export class SubscriptionManager {
  private subscriptions = new Map<string, Subscription>();
  private topicSubscriptions = new Map<string, Set<string>>();
  private subscriptionIdCounter = 0;

  /**
   * Subscribe to a topic
   */
  subscribe(topic: string, callback: SubscriptionCallback): string {
    const id = `sub-${++this.subscriptionIdCounter}`;

    const subscription: Subscription = {
      id,
      topic,
      callback,
    };

    this.subscriptions.set(id, subscription);

    if (!this.topicSubscriptions.has(topic)) {
      this.topicSubscriptions.set(topic, new Set());
    }
    
    this.topicSubscriptions.get(topic)!.add(id);

    return id;
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    
    if (!subscription) {
      return false;
    }

    this.subscriptions.delete(subscriptionId);
    this.topicSubscriptions.get(subscription.topic)?.delete(subscriptionId);

    return true;
  }

  /**
   * Publish data to topic
   */
  publish(topic: string, data: any): void {
    const subscriptionIds = this.topicSubscriptions.get(topic);
    
    if (!subscriptionIds) {
      return;
    }

    subscriptionIds.forEach(id => {
      const subscription = this.subscriptions.get(id);
      if (subscription) {
        subscription.callback(data);
      }
    });
  }

  /**
   * Get subscription count for topic
   */
  getSubscriptionCount(topic: string): number {
    return this.topicSubscriptions.get(topic)?.size || 0;
  }

  /**
   * Clear all subscriptions
   */
  clear(): void {
    this.subscriptions.clear();
    this.topicSubscriptions.clear();
  }

  /**
   * Get all active topics
   */
  getActiveTopics(): string[] {
    return Array.from(this.topicSubscriptions.keys());
  }
}

export const subscriptionManager = new SubscriptionManager();

