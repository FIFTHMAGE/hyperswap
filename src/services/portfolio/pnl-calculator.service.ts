/**
 * Portfolio P&L calculator service
 * @module services/portfolio/pnl-calculator
 */

/**
 * Calculate realized P&L
 */
export function calculateRealizedPnL(params: {
  buyPrice: number;
  sellPrice: number;
  amount: number;
}): { profit: number; percentage: number } {
  const cost = params.buyPrice * params.amount;
  const revenue = params.sellPrice * params.amount;
  const profit = revenue - cost;
  const percentage = cost > 0 ? (profit / cost) * 100 : 0;
  
  return { profit, percentage };
}

/**
 * Calculate unrealized P&L
 */
export function calculateUnrealizedPnL(params: {
  buyPrice: number;
  currentPrice: number;
  amount: number;
}): { profit: number; percentage: number } {
  const cost = params.buyPrice * params.amount;
  const currentValue = params.currentPrice * params.amount;
  const profit = currentValue - cost;
  const percentage = cost > 0 ? (profit / cost) * 100 : 0;
  
  return { profit, percentage };
}

/**
 * Calculate FIFO cost basis
 */
export function calculateFIFO(
  purchases: Array<{ price: number; amount: number; timestamp: number }>,
  sellAmount: number
): { costBasis: number; remainingPurchases: typeof purchases } {
  let remaining = sellAmount;
  let totalCost = 0;
  const remainingPurchases = [...purchases].sort((a, b) => a.timestamp - b.timestamp);
  
  for (let i = 0; i < remainingPurchases.length && remaining > 0; i++) {
    const purchase = remainingPurchases[i];
    const amountToUse = Math.min(remaining, purchase.amount);
    
    totalCost += amountToUse * purchase.price;
    purchase.amount -= amountToUse;
    remaining -= amountToUse;
    
    if (purchase.amount === 0) {
      remainingPurchases.splice(i, 1);
      i--;
    }
  }
  
  return {
    costBasis: totalCost,
    remainingPurchases: remainingPurchases.filter(p => p.amount > 0),
  };
}

/**
 * Calculate average cost basis
 */
export function calculateAverageCost(
  purchases: Array<{ price: number; amount: number }>
): number {
  const totalCost = purchases.reduce((sum, p) => sum + p.price * p.amount, 0);
  const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
  
  return totalAmount > 0 ? totalCost / totalAmount : 0;
}

/**
 * Calculate portfolio ROI
 */
export function calculatePortfolioROI(
  initialValue: number,
  currentValue: number
): { roi: number; multiple: number } {
  const roi = initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0;
  const multiple = initialValue > 0 ? currentValue / initialValue : 0;
  
  return { roi, multiple };
}

