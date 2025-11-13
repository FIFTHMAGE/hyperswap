import { WebSocketClient } from './websocket-client';

export interface PriceUpdate {
  token: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

export class PriceFeed {
  private wsClient: WebSocketClient;
  private priceCache: Map<string, PriceUpdate> = new Map();

  constructor(wsUrl: string) {
    this.wsClient = new WebSocketClient(wsUrl);
  }

  connect(): void {
    this.wsClient.connect();
  }

  disconnect(): void {
    this.wsClient.disconnect();
  }

  subscribeToPrices(
    tokens: string[],
    callback: (update: PriceUpdate) => void
  ): () => void {
    const unsubscribers = tokens.map(token => {
      return this.wsClient.subscribe(`price:${token}`, (data) => {
        const update: PriceUpdate = {
          token,
          ...data,
          timestamp: Date.now(),
        };
        this.priceCache.set(token, update);
        callback(update);
      });
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  getCurrentPrice(token: string): PriceUpdate | null {
    return this.priceCache.get(token) || null;
  }

  getAllPrices(): Map<string, PriceUpdate> {
    return new Map(this.priceCache);
  }
}

