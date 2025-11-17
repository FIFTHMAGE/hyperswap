/**
 * Date and time formatting utilities
 * @module utils/format/date
 */

import { format, formatDistanceToNow, isToday, isYesterday, differenceInHours } from 'date-fns';

/**
 * Format date in a standard way
 */
export function formatDate(date: Date | number | string): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy');
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | number | string): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

/**
 * Format time only
 */
export function formatTime(date: Date | number | string): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'h:mm a');
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelative(date: Date | number | string): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isToday(d)) {
    const hoursDiff = differenceInHours(new Date(), d);
    if (hoursDiff < 1) return formatDistanceToNow(d, { addSuffix: true });
    return `Today at ${formatTime(d)}`;
  }

  if (isYesterday(d)) {
    return `Yesterday at ${formatTime(d)}`;
  }

  return formatDateTime(d);
}

/**
 * Format timestamp (seconds) to date
 */
export function formatTimestamp(timestamp: number): string {
  return formatDate(timestamp * 1000);
}

/**
 * Format timestamp with time
 */
export function formatTimestampWithTime(timestamp: number): string {
  return formatDateTime(timestamp * 1000);
}

/**
 * Format duration in seconds
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

/**
 * Format date for URL/filename
 */
export function formatDateForFilename(date: Date | number | string = new Date()): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd');
}
