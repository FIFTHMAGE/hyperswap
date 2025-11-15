export interface YearlyStats {
  year: number;
  transactions: number;
  gasSpent: number;
  uniqueTokens: number;
  uniqueChains: number;
}

export interface YearComparison {
  current: YearlyStats;
  previous: YearlyStats;
  growth: {
    transactions: number;
    gasSpent: number;
    uniqueTokens: number;
    uniqueChains: number;
  };
}

export function compareYears(
  currentYear: YearlyStats,
  previousYear: YearlyStats
): YearComparison {
  const calculateGrowth = (current: number, previous: number) =>
    previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current: currentYear,
    previous: previousYear,
    growth: {
      transactions: calculateGrowth(currentYear.transactions, previousYear.transactions),
      gasSpent: calculateGrowth(currentYear.gasSpent, previousYear.gasSpent),
      uniqueTokens: calculateGrowth(currentYear.uniqueTokens, previousYear.uniqueTokens),
      uniqueChains: calculateGrowth(currentYear.uniqueChains, previousYear.uniqueChains),
    },
  };
}

