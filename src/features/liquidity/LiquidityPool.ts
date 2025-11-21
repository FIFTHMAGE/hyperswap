/**
 * Liquidity Pool Manager
 * Handles liquidity pool positions and management
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface PoolPosition {
  id: string;
  poolAddress: string;
  token0: string;
  token1: string;
  token0Symbol: string;
  token1Symbol: string;
  amount0: string;
  amount1: string;
  liquidity: string;
  shares: string;
  feeTier: number;
  chainId: number;
  createdAt: Date;
  lastUpdated: Date;
  unclaimed;

  Fees: {
    token0: string;
    token1: string;
  };
  apy?: number;
  totalValue?: string;
}

export interface PoolStats {
  tvl: string;
  volume24h: string;
  fees24h: string;
  apy: number;
  reserve0: string;
  reserve1: string;
}

const STORAGE_KEY = 'liquidity_positions';

export class LiquidityPool {
  private positions: PoolPosition[] = [];
  private storageManager: StorageManager;
  private listeners: Set<(positions: PoolPosition[]) => void> = new Set();

  constructor() {
    this.storageManager = new StorageManager();
    this.loadPositions();
  }

  /**
   * Load positions from storage
   */
  private loadPositions(): void {
    try {
      const stored = this.storageManager.get<PoolPosition[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.positions = stored.map((pos) => ({
          ...pos,
          createdAt: new Date(pos.createdAt),
          lastUpdated: new Date(pos.lastUpdated),
        }));
      }
    } catch (error) {
      logger.error('Error loading liquidity positions:', error);
    }
  }

  /**
   * Save positions to storage
   */
  private savePositions(): void {
    try {
      this.storageManager.set(STORAGE_KEY, this.positions);
    } catch (error) {
      logger.error('Error saving liquidity positions:', error);
    }
  }

  /**
   * Add liquidity position
   */
  addPosition(position: Omit<PoolPosition, 'id' | 'createdAt' | 'lastUpdated'>): string {
    const newPosition: PoolPosition = {
      ...position,
      id: this.generateId(),
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    this.positions.unshift(newPosition);
    this.savePositions();
    this.notifyListeners();

    return newPosition.id;
  }

  /**
   * Update position
   */
  updatePosition(
    positionId: string,
    updates: Partial<Omit<PoolPosition, 'id' | 'createdAt'>>
  ): void {
    const position = this.positions.find((p) => p.id === positionId);
    if (!position) {
      logger.warn(`Position ${positionId} not found`);
      return;
    }

    Object.assign(position, updates, { lastUpdated: new Date() });
    this.savePositions();
    this.notifyListeners();
  }

  /**
   * Remove position
   */
  removePosition(positionId: string): void {
    this.positions = this.positions.filter((p) => p.id !== positionId);
    this.savePositions();
    this.notifyListeners();
  }

  /**
   * Get position by ID
   */
  getPosition(positionId: string): PoolPosition | undefined {
    return this.positions.find((p) => p.id === positionId);
  }

  /**
   * Get all positions
   */
  getAllPositions(): PoolPosition[] {
    return [...this.positions];
  }

  /**
   * Get positions by chain
   */
  getPositionsByChain(chainId: number): PoolPosition[] {
    return this.positions.filter((p) => p.chainId === chainId);
  }

  /**
   * Get positions by token
   */
  getPositionsByToken(tokenAddress: string): PoolPosition[] {
    const lowerAddress = tokenAddress.toLowerCase();
    return this.positions.filter(
      (p) => p.token0.toLowerCase() === lowerAddress || p.token1.toLowerCase() === lowerAddress
    );
  }

  /**
   * Calculate position value
   */
  calculatePositionValue(position: PoolPosition, token0Price: string, token1Price: string): string {
    try {
      const amount0 = parseFloat(position.amount0);
      const amount1 = parseFloat(position.amount1);
      const price0 = parseFloat(token0Price);
      const price1 = parseFloat(token1Price);

      const value = amount0 * price0 + amount1 * price1;
      return value.toFixed(6);
    } catch (error) {
      logger.error('Error calculating position value:', error);
      return '0';
    }
  }

  /**
   * Calculate total portfolio value
   */
  calculatePortfolioValue(prices: Record<string, string>): string {
    try {
      let totalValue = 0;

      this.positions.forEach((position) => {
        const price0 = parseFloat(prices[position.token0] || '0');
        const price1 = parseFloat(prices[position.token1] || '0');
        const amount0 = parseFloat(position.amount0);
        const amount1 = parseFloat(position.amount1);

        totalValue += amount0 * price0 + amount1 * price1;
      });

      return totalValue.toFixed(6);
    } catch (error) {
      logger.error('Error calculating portfolio value:', error);
      return '0';
    }
  }

  /**
   * Calculate impermanent loss
   */
  calculateImpermanentLoss(
    initialPrice: string,
    currentPrice: string,
    initialAmount0: string,
    initialAmount1: string
  ): number {
    try {
      const priceRatio = parseFloat(currentPrice) / parseFloat(initialPrice);
      const k = Math.sqrt(priceRatio);

      // Value if held
      const heldValue =
        parseFloat(initialAmount0) * parseFloat(currentPrice) + parseFloat(initialAmount1);

      // Value in pool
      const poolAmount0 = parseFloat(initialAmount0) / k;
      const poolAmount1 = parseFloat(initialAmount1) * k;
      const poolValue = poolAmount0 * parseFloat(currentPrice) + poolAmount1;

      // Impermanent loss percentage
      return ((poolValue - heldValue) / heldValue) * 100;
    } catch (error) {
      logger.error('Error calculating impermanent loss:', error);
      return 0;
    }
  }

  /**
   * Estimate fees earned
   */
  estimateFeesEarned(
    position: PoolPosition,
    volume24h: string,
    feeTier: number
  ): { token0: string; token1: string } {
    try {
      const volume = parseFloat(volume24h);
      const feePercentage = feeTier / 1000000; // Convert from basis points

      const totalFees = volume * feePercentage;

      // Estimate position's share based on liquidity
      const positionShare = 0.01; // Placeholder - would need total pool liquidity

      const earnedFees = totalFees * positionShare;

      // Split equally between tokens
      return {
        token0: (earnedFees / 2).toFixed(6),
        token1: (earnedFees / 2).toFixed(6),
      };
    } catch (error) {
      logger.error('Error estimating fees:', error);
      return { token0: '0', token1: '0' };
    }
  }

  /**
   * Calculate share of pool
   */
  calculatePoolShare(positionLiquidity: string, totalLiquidity: string): number {
    try {
      const position = parseFloat(positionLiquidity);
      const total = parseFloat(totalLiquidity);

      if (total === 0) return 0;

      return (position / total) * 100;
    } catch (error) {
      logger.error('Error calculating pool share:', error);
      return 0;
    }
  }

  /**
   * Get portfolio statistics
   */
  getPortfolioStats(prices: Record<string, string>): {
    totalPositions: number;
    totalValue: string;
    totalUnclaimedFees: string;
    avgApy: number;
    byChain: Record<number, number>;
  } {
    const byChain: Record<number, number> = {};
    let totalUnclaimedFees = 0;
    let totalApy = 0;
    let countWithApy = 0;

    this.positions.forEach((position) => {
      byChain[position.chainId] = (byChain[position.chainId] || 0) + 1;

      // Sum unclaimed fees (convert to USD using prices)
      const price0 = parseFloat(prices[position.token0] || '0');
      const price1 = parseFloat(prices[position.token1] || '0');
      const fees0 = parseFloat(position.unclaimedFees.token0);
      const fees1 = parseFloat(position.unclaimedFees.token1);

      totalUnclaimedFees += fees0 * price0 + fees1 * price1;

      if (position.apy) {
        totalApy += position.apy;
        countWithApy++;
      }
    });

    return {
      totalPositions: this.positions.length,
      totalValue: this.calculatePortfolioValue(prices),
      totalUnclaimedFees: totalUnclaimedFees.toFixed(6),
      avgApy: countWithApy > 0 ? totalApy / countWithApy : 0,
      byChain,
    };
  }

  /**
   * Search positions
   */
  searchPositions(query: string): PoolPosition[] {
    const lowerQuery = query.toLowerCase();

    return this.positions.filter(
      (position) =>
        position.token0Symbol.toLowerCase().includes(lowerQuery) ||
        position.token1Symbol.toLowerCase().includes(lowerQuery) ||
        position.poolAddress.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Sort positions
   */
  sortPositions(
    sortBy: 'value' | 'apy' | 'created' | 'updated',
    prices?: Record<string, string>
  ): PoolPosition[] {
    const sorted = [...this.positions];

    switch (sortBy) {
      case 'value':
        if (!prices) return sorted;
        return sorted.sort((a, b) => {
          const valueA = parseFloat(
            this.calculatePositionValue(a, prices[a.token0] || '0', prices[a.token1] || '0')
          );
          const valueB = parseFloat(
            this.calculatePositionValue(b, prices[b.token0] || '0', prices[b.token1] || '0')
          );
          return valueB - valueA;
        });

      case 'apy':
        return sorted.sort((a, b) => (b.apy || 0) - (a.apy || 0));

      case 'created':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      case 'updated':
        return sorted.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

      default:
        return sorted;
    }
  }

  /**
   * Subscribe to position changes
   */
  subscribe(callback: (positions: PoolPosition[]) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.getAllPositions());
      } catch (error) {
        logger.error('Error notifying liquidity listener:', error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `lp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Export positions
   */
  export(): string {
    return JSON.stringify(this.positions, null, 2);
  }

  /**
   * Import positions
   */
  import(data: string): void {
    try {
      const imported = JSON.parse(data) as PoolPosition[];
      if (Array.isArray(imported)) {
        this.positions = imported.map((pos) => ({
          ...pos,
          createdAt: new Date(pos.createdAt),
          lastUpdated: new Date(pos.lastUpdated),
        }));
        this.savePositions();
        this.notifyListeners();
      }
    } catch (error) {
      logger.error('Error importing positions:', error);
      throw new Error('Failed to import positions');
    }
  }

  /**
   * Clear all positions
   */
  clearAll(): void {
    this.positions = [];
    this.savePositions();
    this.notifyListeners();
  }
}

// Singleton instance
export const liquidityPool = new LiquidityPool();
