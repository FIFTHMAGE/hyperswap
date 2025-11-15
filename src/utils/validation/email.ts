/**
 * Email validation utilities
 * @module utils/validation/email
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Disposable email domains to block
 */
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  '10minutemail.com',
  'guerrillamail.com',
];

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.toLowerCase().trim());
}

/**
 * Check if email is disposable
 */
export function isDisposableEmail(email: string): boolean {
  if (!isValidEmail(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Validate email with detailed result
 */
export function validateEmail(
  email: string,
  options: { allowDisposable?: boolean } = {}
): { valid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (!options.allowDisposable && isDisposableEmail(email)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  return { valid: true };
}

/**
 * Normalize email (lowercase and trim)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Get email domain
 */
export function getEmailDomain(email: string): string | null {
  if (!isValidEmail(email)) return null;
  return email.split('@')[1]?.toLowerCase() ?? null;
}
