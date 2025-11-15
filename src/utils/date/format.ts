/**
 * Date formatting utilities
 * @module utils/date
 */

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string | number, locale = 'en-US'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale);
}

/**
 * Format time to locale string
 */
export function formatTime(date: Date | string | number, locale = 'en-US'): string {
  const d = new Date(date);
  return d.toLocaleTimeString(locale);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string | number, locale = 'en-US'): string {
  const d = new Date(date);
  return d.toLocaleString(locale);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Format ISO date
 */
export function formatISO(date: Date | string | number): string {
  const d = new Date(date);
  return d.toISOString();
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateYMD(date: Date | string | number): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
