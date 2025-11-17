/**
 * Liquidity pool discovery and analytics service
 */

import { LiquidityPool, PoolAnalytics, PoolPosition, PoolFilters } from '../types/liquidity';

export class LiquidityService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = '/api/liquidity') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Discover liquidity pools based on filters
   */
  async discoverPools(filters: PoolFilters = {}): Promise<LiquidityPool[]> {
    try {
      const params = new URLSearchParams();

      if (filters.minTVL) params.append('minTVL', filters.minTVL.toString());
      if (filters.minVolume24h) params.append('minVolume24h', filters.minVolume24h.toString());
      if (filters.minAPY) params.append('minAPY', filters.minAPY.toString());
      if (filters.protocols) params.append('protocols', filters.protocols.join(','));
      if (filters.tokens) params.append('tokens', filters.tokens.join(','));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

      const response = await fetch(`${this.apiBaseUrl}/discover?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }

      return await response.json();
    } catch (error) {
      console.error('Error discovering pools:', error);
      return [];
    }
  }

  /**
   * Get detailed analytics for a specific pool
   */
  async getPoolAnalytics(
    poolAddress: string,
    timeframe: '24h' | '7d' | '30d' = '7d'
  ): Promise<PoolAnalytics | null> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/analytics/${poolAddress}?timeframe=${timeframe}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pool analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pool analytics:', error);
      return null;
    }
  }

  /**
   * Get user's positions in liquidity pools
   */
  async getUserPositions(userAddress: string): Promise<PoolPosition[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/positions/${userAddress}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user positions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user positions:', error);
      return [];
    }
  }

  /**
   * Search pools by token pair
   */
  async searchPoolsByTokens(token0: string, token1: string): Promise<LiquidityPool[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/search?token0=${token0}&token1=${token1}`);

      if (!response.ok) {
        throw new Error('Failed to search pools');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching pools:', error);
      return [];
    }
  }

  /**
   * Get top pools by various metrics
   */
  async getTopPools(
    metric: 'tvl' | 'volume' | 'apy' = 'tvl',
    limit: number = 10
  ): Promise<LiquidityPool[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/top?metric=${metric}&limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch top pools');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching top pools:', error);
      return [];
    }
  }

  /**
   * Calculate impermanent loss for a position
   */
  calculateImpermanentLoss(initialPrice: number, currentPrice: number): number {
    const priceRatio = currentPrice / initialPrice;
    const holdingValue = (priceRatio + 1) / 2;
    const poolValue = (2 * Math.sqrt(priceRatio)) / (priceRatio + 1);
    return ((poolValue - holdingValue) / holdingValue) * 100;
  }
}

export const liquidityService = new LiquidityService();
