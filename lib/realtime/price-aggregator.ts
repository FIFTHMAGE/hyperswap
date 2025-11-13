/**
 * Price aggregation from multiple sources
 */

export class PriceAggregator {
  private prices: Map<string, Map<string, number>> = new Map();

  addPrice(source: string, symbol: string, price: number): void {
    if (!this.prices.has(symbol)) {
      this.prices.set(symbol, new Map());
    }
    this.prices.get(symbol)!.set(source, price);
  }

  getAveragePrice(symbol: string): number | null {
    const symbolPrices = this.prices.get(symbol);
    if (!symbolPrices || symbolPrices.size === 0) return null;

    const values = Array.from(symbolPrices.values());
    return values.reduce((sum, price) => sum + price, 0) / values.length;
  }

  getMedianPrice(symbol: string): number | null {
    const symbolPrices = this.prices.get(symbol);
    if (!symbolPrices || symbolPrices.size === 0) return null;

    const values = Array.from(symbolPrices.values()).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  }

  getBestPrice(symbol: string, side: 'buy' | 'sell'): number | null {
    const symbolPrices = this.prices.get(symbol);
    if (!symbolPrices || symbolPrices.size === 0) return null;

    const values = Array.from(symbolPrices.values());
    return side === 'buy'
      ? Math.min(...values)
      : Math.max(...values);
  }
}

export const priceAggregator = new PriceAggregator();

