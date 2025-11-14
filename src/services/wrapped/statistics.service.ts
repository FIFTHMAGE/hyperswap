/**
 * Wrapped statistics service
 * @module services/wrapped/statistics
 */

import type { WrappedStats } from '@/types/wrapped/stats';

/**
 * Calculate user rank/percentile
 */
export function calculateUserRank(
  userStats: WrappedStats,
  allUsersStats: WrappedStats[]
): { rank: number; percentile: number } {
  const sorted = allUsersStats.sort((a, b) => b.totalVolumeUSD - a.totalVolumeUSD);
  const rank = sorted.findIndex(s => s.address === userStats.address) + 1;
  const percentile = (rank / sorted.length) * 100;
  
  return { rank, percentile };
}

/**
 * Get most active day
 */
export function getMostActiveDay(transactions: any[]): {
  date: string;
  count: number;
} {
  const dailyCounts = new Map<string, number>();
  
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp * 1000).toDateString();
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
  });
  
  let maxDate = '';
  let maxCount = 0;
  
  dailyCounts.forEach((count, date) => {
    if (count > maxCount) {
      maxCount = count;
      maxDate = date;
    }
  });
  
  return { date: maxDate, count: maxCount };
}

/**
 * Calculate streaks
 */
export function calculateActiveStreaks(transactions: any[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (transactions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  const sortedTxs = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  const dates = new Set(sortedTxs.map(tx =>
    new Date(tx.timestamp * 1000).toDateString()
  ));
  
  const uniqueDates = Array.from(dates).sort();
  
  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
      currentStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return { currentStreak, longestStreak };
}

/**
 * Get favorite time of day
 */
export function getFavoriteTimeOfDay(transactions: any[]): string {
  const hourCounts = new Array(24).fill(0);
  
  transactions.forEach(tx => {
    const hour = new Date(tx.timestamp * 1000).getHours();
    hourCounts[hour]++;
  });
  
  const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
  
  if (maxHour >= 5 && maxHour < 12) return 'Morning';
  if (maxHour >= 12 && maxHour < 17) return 'Afternoon';
  if (maxHour >= 17 && maxHour < 21) return 'Evening';
  return 'Night';
}

