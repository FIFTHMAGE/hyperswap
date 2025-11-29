/**
 * Quote Service
 * Aggregate and compare swap quotes from multiple DEXs
 */

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
}

export interface SwapRoute {
  dex: string;
  path: string[];
  pools: string[];
  fees: number[];
}

export interface Quote {
  id: string;
  dex: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  route: SwapRoute;
  gasEstimate: string;
  fee: string;
  validUntil: Date;
  score: number;
}

export interface AggregatedQuote {
  bestQuote: Quote;
  allQuotes: Quote[];
  savings: string;
  comparison: {
    best: string;
    worst: string;
    average: string;
  };
}

// Supported DEXs
const SUPPORTED_DEXS = ['uniswap_v3', 'sushiswap', 'curve', 'balancer', '1inch'];

// Quote cache
const quoteCache: Map<string, { quote: Quote; expiry: number }> = new Map();
const CACHE_TTL = 15000; // 15 seconds

class QuoteService {
  private dexEndpoints: Record<string, string>;

  constructor() {
    this.dexEndpoints = {
      uniswap_v3: 'https://api.uniswap.org',
      sushiswap: 'https://api.sushi.com',
      curve: 'https://api.curve.fi',
      balancer: 'https://api.balancer.fi',
      '1inch': 'https://api.1inch.io',
    };
  }

  /**
   * Generate cache key
   */
  private getCacheKey(from: Token, to: Token, amount: string): string {
    return `${from.address}_${to.address}_${amount}`;
  }

  /**
   * Generate quote ID
   */
  private generateQuoteId(): string {
    return `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Fetch quote from a specific DEX
   */
  private async fetchDexQuote(
    dex: string,
    fromToken: Token,
    toToken: Token,
    amount: string
  ): Promise<Quote | null> {
    try {
      // In production, call actual DEX APIs
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));

      const fromAmount = parseFloat(amount);
      const baseRate = 0.95 + Math.random() * 0.1;
      const toAmount = fromAmount * baseRate;
      const priceImpact = Math.random() * 2;

      return {
        id: this.generateQuoteId(),
        dex,
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: toAmount.toFixed(6),
        priceImpact,
        route: {
          dex,
          path: [fromToken.address, toToken.address],
          pools: [`${dex}_pool`],
          fees: [3000],
        },
        gasEstimate: (0.001 + Math.random() * 0.01).toFixed(6),
        fee: (fromAmount * 0.003).toFixed(6),
        validUntil: new Date(Date.now() + 30000),
        score: this.calculateQuoteScore(toAmount, priceImpact),
      };
    } catch (error) {
      console.error(`Failed to fetch quote from ${dex}:`, error);
      return null;
    }
  }

  /**
   * Calculate quote score for ranking
   */
  private calculateQuoteScore(toAmount: number, priceImpact: number): number {
    // Higher output and lower impact = better score
    return toAmount * (100 - priceImpact) / 100;
  }

  /**
   * Get best quote from all DEXs
   */
  async getBestQuote(
    fromToken: Token,
    toToken: Token,
    amount: string
  ): Promise<AggregatedQuote | null> {
    if (!amount || parseFloat(amount) <= 0) {
      return null;
    }

    // Check cache
    const cacheKey = this.getCacheKey(fromToken, toToken, amount);
    const cached = quoteCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return {
        bestQuote: cached.quote,
        allQuotes: [cached.quote],
        savings: '0',
        comparison: {
          best: cached.quote.toAmount,
          worst: cached.quote.toAmount,
          average: cached.quote.toAmount,
        },
      };
    }

    // Fetch quotes from all DEXs in parallel
    const quotePromises = SUPPORTED_DEXS.map(dex =>
      this.fetchDexQuote(dex, fromToken, toToken, amount)
    );

    const results = await Promise.allSettled(quotePromises);
    const quotes = results
      .filter((r): r is PromiseFulfilledResult<Quote | null> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter((q): q is Quote => q !== null);

    if (quotes.length === 0) {
      return null;
    }

    // Sort by score (descending)
    quotes.sort((a, b) => b.score - a.score);

    const bestQuote = quotes[0];
    const worstQuote = quotes[quotes.length - 1];

    // Calculate savings
    const savings = (parseFloat(bestQuote.toAmount) - parseFloat(worstQuote.toAmount)).toFixed(6);

    // Calculate average
    const average = (quotes.reduce((sum, q) => sum + parseFloat(q.toAmount), 0) / quotes.length).toFixed(6);

    // Cache best quote
    quoteCache.set(cacheKey, { quote: bestQuote, expiry: Date.now() + CACHE_TTL });

    return {
      bestQuote,
      allQuotes: quotes,
      savings,
      comparison: {
        best: bestQuote.toAmount,
        worst: worstQuote.toAmount,
        average,
      },
    };
  }

  /**
   * Get quote from specific DEX
   */
  async getQuoteFromDex(
    dex: string,
    fromToken: Token,
    toToken: Token,
    amount: string
  ): Promise<Quote | null> {
    if (!SUPPORTED_DEXS.includes(dex)) {
      throw new Error(`DEX ${dex} not supported`);
    }
    return this.fetchDexQuote(dex, fromToken, toToken, amount);
  }

  /**
   * Get supported DEXs
   */
  getSupportedDexs(): string[] {
    return [...SUPPORTED_DEXS];
  }

  /**
   * Check if quote is still valid
   */
  isQuoteValid(quote: Quote): boolean {
    return new Date() < quote.validUntil;
  }

  /**
   * Clear quote cache
   */
  clearCache(): void {
    quoteCache.clear();
  }

  /**
   * Calculate price impact warning level
   */
  getPriceImpactLevel(impact: number): 'low' | 'medium' | 'high' | 'critical' {
    if (impact < 1) return 'low';
    if (impact < 3) return 'medium';
    if (impact < 5) return 'high';
    return 'critical';
  }
}

// Export singleton
export const quoteService = new QuoteService();
export { QuoteService, SUPPORTED_DEXS };
export default quoteService;

