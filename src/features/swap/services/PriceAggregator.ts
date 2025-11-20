/**
 * PriceAggregator - Aggregates prices from multiple DEX sources
 * @module features/swap/services
 */

export interface PriceSource {
  source: string;
  price: number;
  volume24h: number;
  liquidity: number;
  timestamp: number;
}

export interface AggregatedPrice {
  token: string;
  baseToken: string;
  weightedAverage: number;
  median: number;
  min: number;
  max: number;
  variance: number;
  sources: PriceSource[];
  confidence: number;
  lastUpdated: number;
}

export interface PriceHistory {
  token: string;
  baseToken: string;
  prices: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
  resolution: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

export class PriceAggregator {
  private priceCache: Map<string, AggregatedPrice> = new Map();
  private historyCache: Map<string, PriceHistory> = new Map();
  private cacheExpiry: number = 60000; // 1 minute

  /**
   * Get aggregated price for token pair
   */
  async getPrice(token: string, baseToken: string): Promise<AggregatedPrice> {
    const cacheKey = `${token}-${baseToken}`;
    const cached = this.priceCache.get(cacheKey);

    if (cached && Date.now() - cached.lastUpdated < this.cacheExpiry) {
      return cached;
    }

    const sources = await this.fetchPricesFromSources(token, baseToken);
    const aggregated = this.aggregatePrices(token, baseToken, sources);

    this.priceCache.set(cacheKey, aggregated);
    return aggregated;
  }

  /**
   * Fetch prices from multiple sources
   */
  private async fetchPricesFromSources(token: string, baseToken: string): Promise<PriceSource[]> {
    const sources: PriceSource[] = [];

    // Fetch from various DEXs
    const uniswapPrice = await this.fetchUniswapPrice(token, baseToken);
    if (uniswapPrice) sources.push(uniswapPrice);

    const sushiswapPrice = await this.fetchSushiswapPrice(token, baseToken);
    if (sushiswapPrice) sources.push(sushiswapPrice);

    const pancakePrice = await this.fetchPancakePrice(token, baseToken);
    if (pancakePrice) sources.push(pancakePrice);

    return sources;
  }

  /**
   * Fetch price from Uniswap
   */
  private async fetchUniswapPrice(_token: string, _baseToken: string): Promise<PriceSource | null> {
    try {
      // Mock implementation
      return {
        source: 'Uniswap V3',
        price: 1.52,
        volume24h: 1000000,
        liquidity: 5000000,
        timestamp: Date.now(),
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch price from SushiSwap
   */
  private async fetchSushiswapPrice(
    _token: string,
    _baseToken: string
  ): Promise<PriceSource | null> {
    try {
      return {
        source: 'SushiSwap',
        price: 1.51,
        volume24h: 500000,
        liquidity: 3000000,
        timestamp: Date.now(),
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch price from PancakeSwap
   */
  private async fetchPancakePrice(_token: string, _baseToken: string): Promise<PriceSource | null> {
    try {
      return {
        source: 'PancakeSwap',
        price: 1.53,
        volume24h: 750000,
        liquidity: 4000000,
        timestamp: Date.now(),
      };
    } catch {
      return null;
    }
  }

  /**
   * Aggregate prices from sources
   */
  private aggregatePrices(
    token: string,
    baseToken: string,
    sources: PriceSource[]
  ): AggregatedPrice {
    if (sources.length === 0) {
      throw new Error('No price sources available');
    }

    // Calculate weighted average based on liquidity
    const totalLiquidity = sources.reduce((sum, s) => sum + s.liquidity, 0);
    const weightedSum = sources.reduce(
      (sum, s) => sum + s.price * (s.liquidity / totalLiquidity),
      0
    );

    // Calculate median
    const sortedPrices = sources.map((s) => s.price).sort((a, b) => a - b);
    const median =
      sortedPrices.length % 2 === 0
        ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
        : sortedPrices[Math.floor(sortedPrices.length / 2)];

    // Calculate variance
    const mean = sources.reduce((sum, s) => sum + s.price, 0) / sources.length;
    const variance =
      sources.reduce((sum, s) => sum + Math.pow(s.price - mean, 2), 0) / sources.length;

    // Calculate confidence (inverse of variance)
    const confidence = Math.max(0, Math.min(100, 100 - variance * 100));

    return {
      token,
      baseToken,
      weightedAverage: weightedSum,
      median,
      min: Math.min(...sortedPrices),
      max: Math.max(...sortedPrices),
      variance,
      sources,
      confidence,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Get price history
   */
  async getPriceHistory(
    token: string,
    baseToken: string,
    resolution: PriceHistory['resolution'] = '1h',
    limit: number = 100
  ): Promise<PriceHistory> {
    const cacheKey = `${token}-${baseToken}-${resolution}`;
    const cached = this.historyCache.get(cacheKey);

    if (cached && Date.now() - cached.prices[0].timestamp < this.cacheExpiry) {
      return cached;
    }

    // Mock implementation - would fetch from API
    const prices = Array.from({ length: limit }, (_, i) => ({
      timestamp: Date.now() - i * this.getResolutionMs(resolution),
      price: 1.5 + Math.random() * 0.1 - 0.05,
      volume: 1000000 + Math.random() * 500000,
    })).reverse();

    const history: PriceHistory = {
      token,
      baseToken,
      prices,
      resolution,
    };

    this.historyCache.set(cacheKey, history);
    return history;
  }

  /**
   * Get resolution in milliseconds
   */
  private getResolutionMs(resolution: PriceHistory['resolution']): number {
    const map: Record<PriceHistory['resolution'], number> = {
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '1h': 3600000,
      '4h': 14400000,
      '1d': 86400000,
    };
    return map[resolution];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.priceCache.clear();
    this.historyCache.clear();
  }

  /**
   * Set cache expiry
   */
  setCacheExpiry(ms: number): void {
    this.cacheExpiry = ms;
  }
}

export const priceAggregator = new PriceAggregator();
