import { format, parseISO, differenceInDays } from 'date-fns';

export function formatDate(date: string | Date, formatString = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function getDaysBetween(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start);
}

export function getActiveDays(dates: string[]): number {
  const uniqueDates = new Set(dates.map(date => format(parseISO(date), 'yyyy-MM-dd')));
  return uniqueDates.size;
}

export function getActiveMonths(dates: string[]): number {
  const uniqueMonths = new Set(dates.map(date => format(parseISO(date), 'yyyy-MM')));
  return uniqueMonths.size;
}

