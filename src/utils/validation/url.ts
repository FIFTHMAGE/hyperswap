/**
 * URL validation utilities
 * @module utils/validation/url
 */

/**
 * URL validation regex
 */
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

/**
 * Allowed protocols for URLs
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate URL with regex (faster but less strict)
 */
export function isValidUrlFast(url: string): boolean {
  if (!url) return false;
  return URL_REGEX.test(url);
}

/**
 * Check if URL is HTTPS
 */
export function isHttpsUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  return url.startsWith('https://');
}

/**
 * Validate URL with options
 */
export function validateUrl(
  url: string,
  options: { requireHttps?: boolean; allowedDomains?: string[] } = {}
): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'URL is required' };
  }

  if (!isValidUrl(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (options.requireHttps && !isHttpsUrl(url)) {
    return { valid: false, error: 'URL must use HTTPS' };
  }

  if (options.allowedDomains) {
    try {
      const domain = new URL(url).hostname;
      const isAllowed = options.allowedDomains.some(
        (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
      );

      if (!isAllowed) {
        return { valid: false, error: 'URL domain is not allowed' };
      }
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  return { valid: true };
}

/**
 * Get URL domain
 */
export function getUrlDomain(url: string): string | null {
  if (!isValidUrl(url)) return null;

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Normalize URL (ensure protocol, remove trailing slash)
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim();

  // Add protocol if missing
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  // Remove trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}
