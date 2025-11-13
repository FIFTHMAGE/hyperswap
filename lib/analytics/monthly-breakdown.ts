export interface MonthlyStats {
  month: string;
  transactions: number;
  gasSpent: number;
  volumeTraded: number;
  uniqueTokens: number;
}

export interface MonthlyBreakdown {
  months: MonthlyStats[];
  bestMonth: MonthlyStats;
  totalVolume: number;
  averageMonthlyActivity: number;
}

export function generateMonthlyBreakdown(
  transactions: any[],
  year: number = 2024
): MonthlyBreakdown {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthlyData: MonthlyStats[] = monthNames.map((month, index) => ({
    month,
    transactions: 0,
    gasSpent: 0,
    volumeTraded: 0,
    uniqueTokens: 0,
  }));

  transactions.forEach(tx => {
    const date = new Date(tx.block_signed_at);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].transactions++;
      monthlyData[monthIndex].gasSpent += parseFloat(tx.gas_spent || '0');
    }
  });

  const bestMonth = monthlyData.reduce((best, current) =>
    current.transactions > best.transactions ? current : best
  );

  const totalVolume = monthlyData.reduce((sum, m) => sum + m.volumeTraded, 0);
  const averageMonthlyActivity = monthlyData.reduce((sum, m) => sum + m.transactions, 0) / 12;

  return {
    months: monthlyData,
    bestMonth,
    totalVolume,
    averageMonthlyActivity,
  };
}

