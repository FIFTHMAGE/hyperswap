export interface PortfolioSnapshot {
  timestamp: number;
  totalValue: number;
  tokens: {
    symbol: string;
    amount: number;
    value: number;
  }[];
}

export interface PortfolioMetrics {
  currentValue: number;
  changePercent: number;
  highestValue: number;
  lowestValue: number;
  averageValue: number;
}

export function calculatePortfolioMetrics(
  snapshots: PortfolioSnapshot[]
): PortfolioMetrics {
  if (snapshots.length === 0) {
    return {
      currentValue: 0,
      changePercent: 0,
      highestValue: 0,
      lowestValue: 0,
      averageValue: 0,
    };
  }

  const values = snapshots.map(s => s.totalValue);
  const currentValue = values[values.length - 1];
  const firstValue = values[0];
  const changePercent = firstValue > 0 
    ? ((currentValue - firstValue) / firstValue) * 100 
    : 0;

  return {
    currentValue,
    changePercent,
    highestValue: Math.max(...values),
    lowestValue: Math.min(...values),
    averageValue: values.reduce((a, b) => a + b, 0) / values.length,
  };
}

