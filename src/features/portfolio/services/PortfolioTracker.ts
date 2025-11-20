/**
 * PortfolioTracker - Track and analyze user portfolio
 * @module features/portfolio/services
 */

export interface TokenHolding {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price: number;
  value: number;
  change24h: number;
  allocation: number;
}

export interface PortfolioStats {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  change7d: number;
  change7dPercent: number;
  change30d: number;
  change30dPercent: number;
  highestValue: number;
  lowestValue: number;
}

export interface PortfolioSnapshot {
  timestamp: number;
  totalValue: number;
  holdings: TokenHolding[];
}

export interface Transaction {
  hash: string;
  type: 'buy' | 'sell' | 'transfer' | 'swap';
  token: string;
  amount: string;
  value: number;
  timestamp: number;
  from: string;
  to: string;
}

export class PortfolioTracker {
  private holdings: Map<string, TokenHolding> = new Map();
  private snapshots: PortfolioSnapshot[] = [];
  private transactions: Transaction[] = [];
  private priceHistory: Map<string, Array<{ timestamp: number; price: number }>> = new Map();

  /**
   * Update holdings for an address
   */
  async updateHoldings(address: string): Promise<TokenHolding[]> {
    // Fetch token balances from blockchain
    const balances = await this.fetchTokenBalances(address);

    // Update holdings map
    this.holdings.clear();
    for (const balance of balances) {
      this.holdings.set(balance.address, balance);
    }

    // Calculate allocations
    this.calculateAllocations();

    return Array.from(this.holdings.values());
  }

  /**
   * Get current portfolio
   */
  getPortfolio(): TokenHolding[] {
    return Array.from(this.holdings.values()).sort((a, b) => b.value - a.value);
  }

  /**
   * Get portfolio statistics
   */
  getStats(): PortfolioStats {
    const totalValue = this.getTotalValue();
    const change24h = this.calculateChange(24 * 60 * 60 * 1000);
    const change7d = this.calculateChange(7 * 24 * 60 * 60 * 1000);
    const change30d = this.calculateChange(30 * 24 * 60 * 60 * 1000);

    const values = this.snapshots.map((s) => s.totalValue);
    const highestValue = values.length > 0 ? Math.max(...values) : totalValue;
    const lowestValue = values.length > 0 ? Math.min(...values) : totalValue;

    return {
      totalValue,
      change24h: change24h.absolute,
      change24hPercent: change24h.percent,
      change7d: change7d.absolute,
      change7dPercent: change7d.percent,
      change30d: change30d.absolute,
      change30dPercent: change30d.percent,
      highestValue,
      lowestValue,
    };
  }

  /**
   * Get portfolio value over time
   */
  getValueHistory(
    period: '24h' | '7d' | '30d' | '1y'
  ): Array<{ timestamp: number; value: number }> {
    const periodMs = this.getPeriodMs(period);
    const cutoff = Date.now() - periodMs;

    return this.snapshots
      .filter((s) => s.timestamp >= cutoff)
      .map((s) => ({
        timestamp: s.timestamp,
        value: s.totalValue,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get token distribution
   */
  getDistribution(): Array<{ token: string; value: number; percentage: number }> {
    const totalValue = this.getTotalValue();
    return Array.from(this.holdings.values())
      .map((holding) => ({
        token: holding.symbol,
        value: holding.value,
        percentage: totalValue > 0 ? (holding.value / totalValue) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Get top gainers
   */
  getTopGainers(limit: number = 5): TokenHolding[] {
    return Array.from(this.holdings.values())
      .filter((h) => h.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, limit);
  }

  /**
   * Get top losers
   */
  getTopLosers(limit: number = 5): TokenHolding[] {
    return Array.from(this.holdings.values())
      .filter((h) => h.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h)
      .slice(0, limit);
  }

  /**
   * Add transaction
   */
  addTransaction(tx: Transaction): void {
    this.transactions.push(tx);
    // Update holdings based on transaction
    this.processTransaction(tx);
  }

  /**
   * Get transaction history
   */
  getTransactions(limit?: number): Transaction[] {
    const sorted = [...this.transactions].sort((a, b) => b.timestamp - a.timestamp);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Get profit/loss analysis
   */
  getProfitLoss(): {
    realized: number;
    unrealized: number;
    total: number;
  } {
    // Calculate realized P&L from completed transactions
    const realized = this.calculateRealizedProfitLoss();

    // Calculate unrealized P&L from current holdings
    const unrealized = this.calculateUnrealizedProfitLoss();

    return {
      realized,
      unrealized,
      total: realized + unrealized,
    };
  }

  /**
   * Take snapshot of current portfolio
   */
  takeSnapshot(): void {
    const snapshot: PortfolioSnapshot = {
      timestamp: Date.now(),
      totalValue: this.getTotalValue(),
      holdings: Array.from(this.holdings.values()),
    };

    this.snapshots.push(snapshot);

    // Keep only last 365 snapshots
    if (this.snapshots.length > 365) {
      this.snapshots = this.snapshots.slice(-365);
    }
  }

  /**
   * Fetch token balances from blockchain
   */
  private async fetchTokenBalances(_address: string): Promise<TokenHolding[]> {
    // Mock implementation - would integrate with blockchain APIs
    const mockTokens = [
      {
        address: '0x1234',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: '2.5',
        decimals: 18,
        price: 2000,
      },
      {
        address: '0x5678',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: '5000',
        decimals: 6,
        price: 1,
      },
      {
        address: '0x9abc',
        symbol: 'LINK',
        name: 'Chainlink',
        balance: '100',
        decimals: 18,
        price: 15,
      },
    ];

    return mockTokens.map((token) => ({
      ...token,
      value: parseFloat(token.balance) * token.price,
      change24h: (Math.random() - 0.5) * 10, // Random change -5% to +5%
      allocation: 0, // Will be calculated
    }));
  }

  /**
   * Calculate portfolio allocations
   */
  private calculateAllocations(): void {
    const totalValue = this.getTotalValue();
    for (const holding of this.holdings.values()) {
      holding.allocation = totalValue > 0 ? (holding.value / totalValue) * 100 : 0;
    }
  }

  /**
   * Get total portfolio value
   */
  private getTotalValue(): number {
    return Array.from(this.holdings.values()).reduce((sum, h) => sum + h.value, 0);
  }

  /**
   * Calculate change over period
   */
  private calculateChange(periodMs: number): { absolute: number; percent: number } {
    const now = Date.now();
    const cutoff = now - periodMs;

    // Find closest snapshot to cutoff time
    const historicalSnapshot = this.snapshots
      .filter((s) => s.timestamp <= cutoff)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (!historicalSnapshot) {
      return { absolute: 0, percent: 0 };
    }

    const currentValue = this.getTotalValue();
    const historicalValue = historicalSnapshot.totalValue;

    const absolute = currentValue - historicalValue;
    const percent = historicalValue > 0 ? (absolute / historicalValue) * 100 : 0;

    return { absolute, percent };
  }

  /**
   * Get period in milliseconds
   */
  private getPeriodMs(period: '24h' | '7d' | '30d' | '1y'): number {
    const periods: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    };
    return periods[period];
  }

  /**
   * Process transaction and update holdings
   */
  private processTransaction(tx: Transaction): void {
    // This would update holdings based on transaction type
    // Simplified implementation
    const holding = this.holdings.get(tx.token);
    if (!holding) return;

    if (tx.type === 'buy') {
      const newBalance = parseFloat(holding.balance) + parseFloat(tx.amount);
      holding.balance = newBalance.toString();
      holding.value = newBalance * holding.price;
    } else if (tx.type === 'sell') {
      const newBalance = parseFloat(holding.balance) - parseFloat(tx.amount);
      holding.balance = newBalance.toString();
      holding.value = newBalance * holding.price;
    }

    this.calculateAllocations();
  }

  /**
   * Calculate realized profit/loss
   */
  private calculateRealizedProfitLoss(): number {
    let realized = 0;

    // Group buy and sell transactions
    const buys: Transaction[] = [];
    const sells: Transaction[] = [];

    for (const tx of this.transactions) {
      if (tx.type === 'buy') buys.push(tx);
      if (tx.type === 'sell') sells.push(tx);
    }

    // Calculate P&L using FIFO method
    for (const sell of sells) {
      const matchingBuys = buys.filter((b) => b.token === sell.token);
      if (matchingBuys.length === 0) continue;

      const buy = matchingBuys[0]; // FIFO
      const costBasis = buy.value;
      const saleValue = sell.value;
      realized += saleValue - costBasis;
    }

    return realized;
  }

  /**
   * Calculate unrealized profit/loss
   */
  private calculateUnrealizedProfitLoss(): number {
    let unrealized = 0;

    for (const holding of this.holdings.values()) {
      // Find purchase transactions for this token
      const purchases = this.transactions.filter(
        (tx) => tx.type === 'buy' && tx.token === holding.address
      );

      if (purchases.length === 0) continue;

      const totalCost = purchases.reduce((sum, tx) => sum + tx.value, 0);
      const currentValue = holding.value;
      unrealized += currentValue - totalCost;
    }

    return unrealized;
  }

  /**
   * Export portfolio data
   */
  export(): {
    holdings: TokenHolding[];
    stats: PortfolioStats;
    transactions: Transaction[];
    snapshots: PortfolioSnapshot[];
  } {
    return {
      holdings: this.getPortfolio(),
      stats: this.getStats(),
      transactions: this.getTransactions(),
      snapshots: this.snapshots,
    };
  }

  /**
   * Import portfolio data
   */
  import(data: {
    holdings?: TokenHolding[];
    transactions?: Transaction[];
    snapshots?: PortfolioSnapshot[];
  }): void {
    if (data.holdings) {
      this.holdings.clear();
      for (const holding of data.holdings) {
        this.holdings.set(holding.address, holding);
      }
    }

    if (data.transactions) {
      this.transactions = [...data.transactions];
    }

    if (data.snapshots) {
      this.snapshots = [...data.snapshots];
    }
  }
}

export const portfolioTracker = new PortfolioTracker();
