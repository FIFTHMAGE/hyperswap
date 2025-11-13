export interface PriceChange {
  current: number;
  previous: number;
  changePercent: number;
  changeAmount: number;
}

export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): PriceChange {
  const changeAmount = currentPrice - previousPrice;
  const changePercent = previousPrice > 0 
    ? (changeAmount / previousPrice) * 100 
    : 0;

  return {
    current: currentPrice,
    previous: previousPrice,
    changePercent,
    changeAmount,
  };
}

export function calculateProfitLoss(
  buyPrice: number,
  sellPrice: number,
  amount: number
): { profit: number; profitPercent: number } {
  const profit = (sellPrice - buyPrice) * amount;
  const profitPercent = buyPrice > 0 
    ? ((sellPrice - buyPrice) / buyPrice) * 100 
    : 0;

  return { profit, profitPercent };
}

