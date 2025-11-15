/**
 * Token price service
 * @module services/token
 */

class TokenPriceService {
  private cache = new Map<string, { price: number; timestamp: number }>();
  private cacheTTL = 60000; // 1 minute

  /**
   * Get token price in USD
   */
  async getPrice(tokenAddress: string, chainId: number): Promise<number> {
    const cacheKey = `${chainId}-${tokenAddress}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.price;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const price = Math.random() * 1000;

    this.cache.set(cacheKey, { price, timestamp: Date.now() });

    return price;
  }

  /**
   * Get prices for multiple tokens
   */
  async getPrices(
    tokens: Array<{ address: string; chainId: number }>
  ): Promise<Map<string, number>> {
    const prices = new Map<string, number>();

    await Promise.all(
      tokens.map(async (token) => {
        const price = await this.getPrice(token.address, token.chainId);
        prices.set(token.address, price);
      })
    );

    return prices;
  }

  /**
   * Get price history
   */
  async getPriceHistory(
    tokenAddress: string,
    chainId: number,
    days: number = 7
  ): Promise<Array<{ timestamp: number; price: number }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return Array.from({ length: days }, (_, i) => ({
      timestamp: Date.now() - (days - i) * 24 * 60 * 60 * 1000,
      price: Math.random() * 1000,
    }));
  }
}

export const tokenPriceService = new TokenPriceService();
