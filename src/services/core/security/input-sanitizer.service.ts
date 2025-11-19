/**
 * Input sanitization service
 * @module services/security/input-sanitizer
 */

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Sanitize string for filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-.]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 255);
}

/**
 * Remove SQL injection patterns
 */
export function sanitizeSQL(input: string): string {
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi;
  return input.replace(sqlPattern, '');
}

/**
 * Escape special characters for regex
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitize address input
 */
export function sanitizeAddress(address: string): string {
  // Remove all non-hex characters except 0x prefix
  const cleaned = address.toLowerCase().replace(/[^0-9a-fx]/g, '');
  
  // Ensure 0x prefix
  if (cleaned.startsWith('0x')) {
    return cleaned;
  }
  
  return `0x${cleaned}`;
}

/**
 * Sanitize amount input
 */
export function sanitizeAmountInput(input: string): string {
  // Allow only digits and one decimal point
  return input.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
}

