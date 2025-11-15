import { Transaction } from '@/lib/types/transaction';

export interface ActivityPattern {
  hourOfDay: number[];
  dayOfWeek: number[];
  monthlyDistribution: number[];
  peakHour: number;
  peakDay: number;
}

export function analyzeActivityPatterns(transactions: Transaction[]): ActivityPattern {
  const hourOfDay = new Array(24).fill(0);
  const dayOfWeek = new Array(7).fill(0);
  const monthlyDistribution = new Array(12).fill(0);

  transactions.forEach(tx => {
    const date = new Date(tx.block_signed_at);
    hourOfDay[date.getHours()]++;
    dayOfWeek[date.getDay()]++;
    monthlyDistribution[date.getMonth()]++;
  });

  const peakHour = hourOfDay.indexOf(Math.max(...hourOfDay));
  const peakDay = dayOfWeek.indexOf(Math.max(...dayOfWeek));

  return {
    hourOfDay,
    dayOfWeek,
    monthlyDistribution,
    peakHour,
    peakDay,
  };
}

