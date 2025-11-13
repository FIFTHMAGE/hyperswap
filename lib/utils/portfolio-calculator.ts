/**
 * Portfolio calculation utilities
 */

import { PortfolioPosition, PortfolioStats, AssetAllocation } from '../types/portfolio';
import { SwapHistoryItem } from '../types/history';

export class PortfolioCalculator {
  /**
   * Calculate positions from transaction history
   */
  static calculatePositions(
    transactions: SwapHistoryItem[],
    currentPrices: Map<string, number>
  ): PortfolioPosition[] {
    const positionsMap = new Map<string, PortfolioPosition>();

    // Process each transaction
    transactions
      .filter((tx) => tx.status === 'success')
      .sort((a, b) => a.timestamp - b.timestamp)
      .forEach((tx) => {
        // Update output token position (buy)
        this.updatePosition(
          positionsMap,
          tx.outputToken.address,
          tx.outputToken.symbol,
          parseFloat(tx.outputToken.amount),
          tx.inputValueUSD || 0,
          tx.timestamp
        );

        // Update input token position (sell)
        this.updatePosition(
          positionsMap,
          tx.inputToken.address,
          tx.inputToken.symbol,
          -parseFloat(tx.inputToken.amount),
          -(tx.inputValueUSD || 0),
          tx.timestamp
        );
      });

    // Calculate current values and P&L
    const positions: PortfolioPosition[] = [];
    positionsMap.forEach((position) => {
      const currentPrice = currentPrices.get(position.tokenAddress) || 0;
      const currentValue = position.quantity * currentPrice;
      const profitLoss = currentValue - position.totalInvested;
      const profitLossPercent =
        position.totalInvested > 0 ? (profitLoss / position.totalInvested) * 100 : 0;

      positions.push({
        ...position,
        currentValue,
        profitLoss,
        profitLossPercent,
      });
    });

    return positions.filter((p) => p.quantity > 0.00001);
  }

  /**
   * Update position with new transaction data
   */
  private static updatePosition(
    positionsMap: Map<string, PortfolioPosition>,
    tokenAddress: string,
    tokenSymbol: string,
    amount: number,
    valueUSD: number,
    timestamp: number
  ) {
    const existing = positionsMap.get(tokenAddress);

    if (existing) {
      const newQuantity = existing.quantity + amount;
      const newInvested = existing.totalInvested + valueUSD;
      const newAverageBuyPrice =
        newQuantity > 0 ? newInvested / newQuantity : existing.averageBuyPrice;

      positionsMap.set(tokenAddress, {
        ...existing,
        quantity: newQuantity,
        totalInvested: newInvested,
        averageBuyPrice: newAverageBuyPrice,
        lastTransactionDate: timestamp,
      });
    } else {
      positionsMap.set(tokenAddress, {
        tokenAddress,
        tokenSymbol,
        quantity: amount,
        totalInvested: valueUSD,
        averageBuyPrice: amount > 0 ? valueUSD / amount : 0,
        currentValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        firstPurchaseDate: timestamp,
        lastTransactionDate: timestamp,
      });
    }
  }

  /**
   * Calculate portfolio statistics
   */
  static calculateStats(positions: PortfolioPosition[]): PortfolioStats {
    const totalValueUSD = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvested = positions.reduce((sum, p) => sum + p.totalInvested, 0);
    const totalProfitLoss = positions.reduce((sum, p) => sum + p.profitLoss, 0);
    const totalProfitLossPercent =
      totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    const sortedByPerformance = [...positions].sort(
      (a, b) => b.profitLossPercent - a.profitLossPercent
    );

    return {
      totalValueUSD,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent,
      change24h: 0, // Would need historical data
      change24hPercent: 0,
      bestPerformer: sortedByPerformance[0]
        ? {
            symbol: sortedByPerformance[0].tokenSymbol,
            profitLossPercent: sortedByPerformance[0].profitLossPercent,
          }
        : null,
      worstPerformer: sortedByPerformance[sortedByPerformance.length - 1]
        ? {
            symbol: sortedByPerformance[sortedByPerformance.length - 1].tokenSymbol,
            profitLossPercent:
              sortedByPerformance[sortedByPerformance.length - 1].profitLossPercent,
          }
        : null,
    };
  }

  /**
   * Calculate asset allocation
   */
  static calculateAllocation(positions: PortfolioPosition[]): AssetAllocation[] {
    const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);

    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // green
      '#ef4444', // red
      '#6366f1', // indigo
      '#14b8a6', // teal
    ];

    return positions
      .map((position, index) => ({
        token: position.tokenSymbol,
        value: position.currentValue,
        percentage: totalValue > 0 ? (position.currentValue / totalValue) * 100 : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Calculate realized vs unrealized gains
   */
  static calculateRealizedGains(transactions: SwapHistoryItem[]): {
    realized: number;
    unrealized: number;
  } {
    // This would require more complex tracking
    // For now, return placeholder
    return {
      realized: 0,
      unrealized: 0,
    };
  }
}

