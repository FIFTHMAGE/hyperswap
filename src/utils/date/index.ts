/**
 * Date utilities
 * @module utils/date
 */

/**
 * Format date to ISO string
 */
export function toISOString(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Get timestamp in seconds
 */
export function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert milliseconds to seconds
 */
export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

/**
 * Convert seconds to milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Check if date is today
 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get start of day timestamp
 */
export function startOfDay(date: Date | number = new Date()): number {
  const d = typeof date === 'number' ? new Date(date) : date;
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Get end of day timestamp
 */
export function endOfDay(date: Date | number = new Date()): number {
  const d = typeof date === 'number' ? new Date(date) : date;
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/**
 * Add days to date
 */
export function addDays(date: Date | number, days: number): Date {
  const d = new Date(typeof date === 'number' ? date : date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Subtract days from date
 */
export function subDays(date: Date | number, days: number): Date {
  return addDays(date, -days);
}

/**
 * Get difference in days between two dates
 */
export function diffInDays(date1: Date | number, date2: Date | number): number {
  const d1 = typeof date1 === 'number' ? date1 : date1.getTime();
  const d2 = typeof date2 === 'number' ? date2 : date2.getTime();

  return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in hours between two dates
 */
export function diffInHours(date1: Date | number, date2: Date | number): number {
  const d1 = typeof date1 === 'number' ? date1 : date1.getTime();
  const d2 = typeof date2 === 'number' ? date2 : date2.getTime();

  return Math.floor((d1 - d2) / (1000 * 60 * 60));
}

/**
 * Get difference in minutes between two dates
 */
export function diffInMinutes(date1: Date | number, date2: Date | number): number {
  const d1 = typeof date1 === 'number' ? date1 : date1.getTime();
  const d2 = typeof date2 === 'number' ? date2 : date2.getTime();

  return Math.floor((d1 - d2) / (1000 * 60));
}

/**
 * Format date to locale string
 */
export function formatDate(
  date: Date | number,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString(locale, options);
}

/**
 * Format time to locale string
 */
export function formatTime(
  date: Date | number,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, options);
}

/**
 * Parse date string
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
