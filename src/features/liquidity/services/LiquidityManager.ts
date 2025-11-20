/**
 * LiquidityManager - Manage liquidity pool positions
 * @module features/liquidity/services
 */

export interface LiquidityPosition {
  id: string;
  poolAddress: string;
  token0: string;
  token1: string;
  amount0: string;
  amount1: string;
  liquidity: string;
  owner: string;
  tickLower?: number;
  tickUpper?: number;
  fee?: number;
  unclaimedFees0?: string;
  unclaimedFees1?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AddLiquidityParams {
  token0: string;
  token1: string;
  amount0: string;
  amount1: string;
  amount0Min: string;
  amount1Min: string;
  recipient: string;
  deadline: number;
  fee?: number;
  tickLower?: number;
  tickUpper?: number;
}

export interface RemoveLiquidityParams {
  positionId: string;
  liquidity: string;
  amount0Min: string;
  amount1Min: string;
  deadline: number;
}

export interface LiquidityQuote {
  amount0: string;
  amount1: string;
  liquidity: string;
  shareOfPool: number;
  priceRange?: {
    lower: string;
    upper: string;
  };
  estimatedFees24h: {
    token0: string;
    token1: string;
    usd: string;
  };
  apr: number;
}

export class LiquidityManager {
  private positions: Map<string, LiquidityPosition> = new Map();

  /**
   * Get liquidity quote
   */
  async getLiquidityQuote(params: AddLiquidityParams): Promise<LiquidityQuote> {
    // Calculate optimal amounts
    const { amount0, amount1 } = this.calculateOptimalAmounts(
      params.amount0,
      params.amount1,
      params.token0,
      params.token1
    );

    // Calculate liquidity
    const liquidity = this.calculateLiquidity(amount0, amount1);

    // Get pool data
    const poolData = await this.getPoolData(params.token0, params.token1, params.fee);

    // Calculate share of pool
    const shareOfPool = this.calculateShareOfPool(liquidity, poolData.totalLiquidity);

    // Estimate fees
    const estimatedFees = this.estimateFees(shareOfPool, poolData);

    // Calculate APR
    const apr = this.calculateAPR(estimatedFees, amount0, amount1);

    return {
      amount0,
      amount1,
      liquidity,
      shareOfPool,
      estimatedFees24h: estimatedFees,
      apr,
    };
  }

  /**
   * Add liquidity to pool
   */
  async addLiquidity(params: AddLiquidityParams): Promise<LiquidityPosition> {
    // Validate parameters
    this.validateAddLiquidityParams(params);

    // Get quote
    const quote = await this.getLiquidityQuote(params);

    // Create position
    const position: LiquidityPosition = {
      id: this.generatePositionId(),
      poolAddress: await this.getPoolAddress(params.token0, params.token1, params.fee),
      token0: params.token0,
      token1: params.token1,
      amount0: quote.amount0,
      amount1: quote.amount1,
      liquidity: quote.liquidity,
      owner: params.recipient,
      tickLower: params.tickLower,
      tickUpper: params.tickUpper,
      fee: params.fee,
      unclaimedFees0: '0',
      unclaimedFees1: '0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.positions.set(position.id, position);
    return position;
  }

  /**
   * Remove liquidity from pool
   */
  async removeLiquidity(params: RemoveLiquidityParams): Promise<{
    amount0: string;
    amount1: string;
    fees0: string;
    fees1: string;
  }> {
    const position = this.positions.get(params.positionId);
    if (!position) {
      throw new Error('Position not found');
    }

    // Calculate amounts to receive
    const liquidityPercent = parseFloat(params.liquidity) / parseFloat(position.liquidity);
    const amount0 =
      (BigInt(position.amount0) * BigInt(Math.floor(liquidityPercent * 100))) / BigInt(100);
    const amount1 =
      (BigInt(position.amount1) * BigInt(Math.floor(liquidityPercent * 100))) / BigInt(100);

    // Get unclaimed fees
    const fees0 = position.unclaimedFees0 || '0';
    const fees1 = position.unclaimedFees1 || '0';

    // Update or remove position
    if (params.liquidity === position.liquidity) {
      this.positions.delete(params.positionId);
    } else {
      const remainingLiquidity = BigInt(position.liquidity) - BigInt(params.liquidity);
      position.liquidity = remainingLiquidity.toString();
      position.amount0 = (BigInt(position.amount0) - amount0).toString();
      position.amount1 = (BigInt(position.amount1) - amount1).toString();
      position.updatedAt = Date.now();
    }

    return {
      amount0: amount0.toString(),
      amount1: amount1.toString(),
      fees0,
      fees1,
    };
  }

  /**
   * Claim accumulated fees
   */
  async claimFees(positionId: string): Promise<{ amount0: string; amount1: string }> {
    const position = this.positions.get(positionId);
    if (!position) {
      throw new Error('Position not found');
    }

    const fees0 = position.unclaimedFees0 || '0';
    const fees1 = position.unclaimedFees1 || '0';

    // Reset unclaimed fees
    position.unclaimedFees0 = '0';
    position.unclaimedFees1 = '0';
    position.updatedAt = Date.now();

    return {
      amount0: fees0,
      amount1: fees1,
    };
  }

  /**
   * Get user positions
   */
  async getUserPositions(userAddress: string): Promise<LiquidityPosition[]> {
    return Array.from(this.positions.values()).filter((p) => p.owner === userAddress);
  }

  /**
   * Get position by ID
   */
  async getPosition(positionId: string): Promise<LiquidityPosition | null> {
    return this.positions.get(positionId) || null;
  }

  /**
   * Update position fees
   */
  async updatePositionFees(positionId: string): Promise<void> {
    const position = this.positions.get(positionId);
    if (!position) return;

    // Fetch current fees from blockchain
    const fees = await this.fetchPositionFees(positionId);
    position.unclaimedFees0 = fees.amount0;
    position.unclaimedFees1 = fees.amount1;
    position.updatedAt = Date.now();
  }

  /**
   * Calculate optimal amounts for liquidity
   */
  private calculateOptimalAmounts(
    amount0Desired: string,
    amount1Desired: string,
    _token0: string,
    _token1: string
  ): { amount0: string; amount1: string } {
    // Mock implementation - would use pool price ratio
    return {
      amount0: amount0Desired,
      amount1: amount1Desired,
    };
  }

  /**
   * Calculate liquidity from amounts
   */
  private calculateLiquidity(amount0: string, amount1: string): string {
    // Simplified calculation
    const amt0 = BigInt(amount0);
    const amt1 = BigInt(amount1);
    return (amt0 * amt1).toString();
  }

  /**
   * Get pool data
   */
  private async getPoolData(
    _token0: string,
    _token1: string,
    _fee?: number
  ): Promise<{
    totalLiquidity: string;
    volume24h: string;
    fees24h: string;
  }> {
    // Mock implementation
    return {
      totalLiquidity: '10000000000000000000000',
      volume24h: '1000000000000000000000',
      fees24h: '3000000000000000000',
    };
  }

  /**
   * Calculate share of pool
   */
  private calculateShareOfPool(liquidity: string, totalLiquidity: string): number {
    const liq = parseFloat(liquidity);
    const total = parseFloat(totalLiquidity);
    return (liq / (total + liq)) * 100;
  }

  /**
   * Estimate fees
   */
  private estimateFees(
    shareOfPool: number,
    poolData: { fees24h: string }
  ): { token0: string; token1: string; usd: string } {
    const dailyFees = parseFloat(poolData.fees24h);
    const userFees = (dailyFees * shareOfPool) / 100;

    return {
      token0: (userFees / 2).toString(),
      token1: (userFees / 2).toString(),
      usd: userFees.toString(),
    };
  }

  /**
   * Calculate APR
   */
  private calculateAPR(estimatedFees: { usd: string }, amount0: string, amount1: string): number {
    const dailyFees = parseFloat(estimatedFees.usd);
    const yearlyFees = dailyFees * 365;
    const totalValue = parseFloat(amount0) + parseFloat(amount1);

    if (totalValue === 0) return 0;

    return (yearlyFees / totalValue) * 100;
  }

  /**
   * Validate add liquidity parameters
   */
  private validateAddLiquidityParams(params: AddLiquidityParams): void {
    if (!params.token0 || !params.token1) {
      throw new Error('Invalid tokens');
    }
    if (BigInt(params.amount0) <= 0 || BigInt(params.amount1) <= 0) {
      throw new Error('Invalid amounts');
    }
    if (params.deadline < Date.now() / 1000) {
      throw new Error('Deadline expired');
    }
  }

  /**
   * Get pool address
   */
  private async getPoolAddress(_token0: string, _token1: string, _fee?: number): Promise<string> {
    // Mock implementation
    return '0x' + Math.random().toString(16).substring(2, 42);
  }

  /**
   * Fetch position fees from blockchain
   */
  private async fetchPositionFees(
    _positionId: string
  ): Promise<{ amount0: string; amount1: string }> {
    // Mock implementation
    return {
      amount0: Math.floor(Math.random() * 1000000000000000).toString(),
      amount1: Math.floor(Math.random() * 1000000000000000).toString(),
    };
  }

  /**
   * Generate position ID
   */
  private generatePositionId(): string {
    return `position_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const liquidityManager = new LiquidityManager();
