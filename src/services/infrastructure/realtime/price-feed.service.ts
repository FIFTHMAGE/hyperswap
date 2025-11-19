/**
 * Real-time price feed service
 * @module services/realtime/price-feed
 */

import { subscriptionManager } from './subscription-manager.service';

export interface PriceUpdate {
  tokenAddress: string;
  chainId: number;
  price: number;
  timestamp: number;
  change24h?: number;
}

class PriceFeedService {
  private priceCache = new Map<string, PriceUpdate>();

  /**
   * Subscribe to price updates for a token
   */
  subscribeToPrice(
    tokenAddress: string,
    chainId: number,
    callback: (update: PriceUpdate) => void
  ): string {
    const topic = this.getPriceTopic(tokenAddress, chainId);
    return subscriptionManager.subscribe(topic, callback);
  }

  /**
   * Unsubscribe from price updates
   */
  unsubscribeFromPrice(subscriptionId: string): boolean {
    return subscriptionManager.unsubscribe(subscriptionId);
  }

  /**
   * Publish price update
   */
  publishPriceUpdate(update: PriceUpdate): void {
    const topic = this.getPriceTopic(update.tokenAddress, update.chainId);
    const key = this.getPriceKey(update.tokenAddress, update.chainId);
    
    this.priceCache.set(key, update);
    subscriptionManager.publish(topic, update);
  }

  /**
   * Get latest price from cache
   */
  getLatestPrice(tokenAddress: string, chainId: number): PriceUpdate | null {
    const key = this.getPriceKey(tokenAddress, chainId);
    return this.priceCache.get(key) || null;
  }

  /**
   * Get price topic
   */
  private getPriceTopic(tokenAddress: string, chainId: number): string {
    return `price:${chainId}:${tokenAddress.toLowerCase()}`;
  }

  /**
   * Get price cache key
   */
  private getPriceKey(tokenAddress: string, chainId: number): string {
    return `${chainId}:${tokenAddress.toLowerCase()}`;
  }

  /**
   * Clear price cache
   */
  clearCache(): void {
    this.priceCache.clear();
  }
}

export const priceFeedService = new PriceFeedService();

