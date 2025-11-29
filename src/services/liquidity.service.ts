/**
 * Liquidity Service
 * Handle liquidity pool operations
 */

export interface Pool {
  address: string;
  token0: string;
  token1: string;
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  fee: number;
  protocol: string;
}

export interface PoolWithPricing extends Pool {
  token0Price: number;
  token1Price: number;
  tvlUSD: number;
  volume24hUSD: number;
  fees24hUSD: number;
  apy: number;
}

export interface UserPosition {
  poolAddress: string;
  lpBalance: bigint;
  token0Amount: bigint;
  token1Amount: bigint;
  shareOfPool: number;
  valueUSD: number;
  unclaimedFees: bigint;
}

export interface AddLiquidityParams {
  poolAddress: string;
  token0Amount: bigint;
  token1Amount: bigint;
  minLpTokens: bigint;
  recipient: string;
  deadline: number;
}

export interface RemoveLiquidityParams {
  poolAddress: string;
  lpAmount: bigint;
  minToken0: bigint;
  minToken1: bigint;
  recipient: string;
  deadline: number;
}

export interface LiquidityQuote {
  token0Amount: bigint;
  token1Amount: bigint;
  lpTokens: bigint;
  shareOfPool: number;
  priceImpact: number;
}

class LiquidityService {
  private pools: Map<string, Pool> = new Map();
  private poolCache: Map<string, { data: PoolWithPricing; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  async getPool(poolAddress: string): Promise<Pool | null> {
    // Check cache first
    const cached = this.poolCache.get(poolAddress);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // In production, fetch from blockchain/subgraph
    const mockPool: Pool = {
      address: poolAddress,
      token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      reserve0: BigInt('1000000000000000000000'), // 1000 ETH
      reserve1: BigInt('2350000000000'), // 2.35M USDC
      totalSupply: BigInt('48472345670000000000000'),
      fee: 3000, // 0.3%
      protocol: 'uniswap_v2',
    };

    this.pools.set(poolAddress, mockPool);
    return mockPool;
  }

  async getPoolWithPricing(poolAddress: string): Promise<PoolWithPricing | null> {
    const pool = await this.getPool(poolAddress);
    if (!pool) return null;

    // In production, fetch prices from oracle
    const ethPrice = 2350;
    const reserve0Float = Number(pool.reserve0) / 1e18;
    const reserve1Float = Number(pool.reserve1) / 1e6;

    const poolWithPricing: PoolWithPricing = {
      ...pool,
      token0Price: ethPrice,
      token1Price: 1,
      tvlUSD: reserve0Float * ethPrice + reserve1Float,
      volume24hUSD: 1250000,
      fees24hUSD: 3750,
      apy: 24.5,
    };

    this.poolCache.set(poolAddress, {
      data: poolWithPricing,
      timestamp: Date.now(),
    });

    return poolWithPricing;
  }

  async getAllPools(protocol?: string): Promise<PoolWithPricing[]> {
    // In production, fetch from subgraph
    const mockPools: Pool[] = [
      {
        address: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
        token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        reserve0: BigInt('50000000000000000000000'),
        reserve1: BigInt('117500000000000'),
        totalSupply: BigInt('2423617830000000000000000'),
        fee: 3000,
        protocol: 'uniswap_v2',
      },
      {
        address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
        token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        reserve0: BigInt('235000000000000'),
        reserve1: BigInt('100000000000000000000000'),
        totalSupply: BigInt('4847234567000000000000'),
        fee: 3000,
        protocol: 'uniswap_v2',
      },
    ];

    const poolsWithPricing = await Promise.all(
      mockPools
        .filter(p => !protocol || p.protocol === protocol)
        .map(async pool => {
          const pricing = await this.getPoolWithPricing(pool.address);
          return pricing!;
        })
    );

    return poolsWithPricing.filter(Boolean);
  }

  async getUserPositions(userAddress: string): Promise<UserPosition[]> {
    // In production, fetch from blockchain
    const mockPositions: UserPosition[] = [
      {
        poolAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
        lpBalance: BigInt('1000000000000000000'),
        token0Amount: BigInt('500000000000000000'),
        token1Amount: BigInt('1175000000'),
        shareOfPool: 0.0004,
        valueUSD: 2350,
        unclaimedFees: BigInt('5000000000000000'),
      },
    ];

    return mockPositions;
  }

  async quoteAddLiquidity(
    poolAddress: string,
    token0Amount: bigint,
    isToken0: boolean
  ): Promise<LiquidityQuote> {
    const pool = await this.getPool(poolAddress);
    if (!pool) {
      throw new Error('Pool not found');
    }

    const { reserve0, reserve1, totalSupply } = pool;

    let calculatedToken0: bigint;
    let calculatedToken1: bigint;

    if (isToken0) {
      calculatedToken0 = token0Amount;
      calculatedToken1 = (token0Amount * reserve1) / reserve0;
    } else {
      calculatedToken1 = token0Amount;
      calculatedToken0 = (token0Amount * reserve0) / reserve1;
    }

    // Calculate LP tokens using geometric mean
    const lpTokens = (calculatedToken0 * totalSupply) / reserve0;

    const newTotalSupply = totalSupply + lpTokens;
    const shareOfPool = Number(lpTokens * BigInt(10000) / newTotalSupply) / 100;

    return {
      token0Amount: calculatedToken0,
      token1Amount: calculatedToken1,
      lpTokens,
      shareOfPool,
      priceImpact: shareOfPool > 5 ? shareOfPool * 0.1 : 0,
    };
  }

  async quoteRemoveLiquidity(
    poolAddress: string,
    lpAmount: bigint
  ): Promise<{ token0Amount: bigint; token1Amount: bigint; shareRemoved: number }> {
    const pool = await this.getPool(poolAddress);
    if (!pool) {
      throw new Error('Pool not found');
    }

    const { reserve0, reserve1, totalSupply } = pool;

    const token0Amount = (lpAmount * reserve0) / totalSupply;
    const token1Amount = (lpAmount * reserve1) / totalSupply;
    const shareRemoved = Number(lpAmount * BigInt(10000) / totalSupply) / 100;

    return {
      token0Amount,
      token1Amount,
      shareRemoved,
    };
  }

  async addLiquidity(params: AddLiquidityParams): Promise<{ transactionHash: string; lpReceived: bigint }> {
    // In production, execute blockchain transaction
    const quote = await this.quoteAddLiquidity(params.poolAddress, params.token0Amount, true);

    if (quote.lpTokens < params.minLpTokens) {
      throw new Error('Insufficient LP tokens');
    }

    return {
      transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      lpReceived: quote.lpTokens,
    };
  }

  async removeLiquidity(params: RemoveLiquidityParams): Promise<{
    transactionHash: string;
    token0Received: bigint;
    token1Received: bigint;
  }> {
    const quote = await this.quoteRemoveLiquidity(params.poolAddress, params.lpAmount);

    if (quote.token0Amount < params.minToken0 || quote.token1Amount < params.minToken1) {
      throw new Error('Slippage too high');
    }

    return {
      transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      token0Received: quote.token0Amount,
      token1Received: quote.token1Amount,
    };
  }

  calculateImpermanentLoss(
    initialPrice: number,
    currentPrice: number
  ): number {
    const priceRatio = currentPrice / initialPrice;
    const sqrtPriceRatio = Math.sqrt(priceRatio);
    const il = (2 * sqrtPriceRatio) / (1 + priceRatio) - 1;
    return il * 100;
  }

  clearCache(): void {
    this.poolCache.clear();
  }
}

export const liquidityService = new LiquidityService();
export default liquidityService;

