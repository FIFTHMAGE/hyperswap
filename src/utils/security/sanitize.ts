/**
 * Security sanitization utilities
 * @module utils/security/sanitize
 */

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  cleaned = cleaned.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');

  return cleaned;
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Strip HTML tags
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators
  let sanitized = filename.replace(/[/\\]/g, '');

  // Remove special characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');

  // Limit length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.split('.').pop() || '';
    const nameLength = maxLength - ext.length - 1;
    sanitized = sanitized.slice(0, nameLength) + '.' + ext;
  }

  return sanitized;
}

/**
 * Sanitize object keys (prevent prototype pollution)
 */
export function sanitizeObjectKeys<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as T;

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !['__proto__', 'constructor', 'prototype'].includes(key)) {
      sanitized[key] = obj[key];
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize JSON
 */
export function sanitizeJson(json: string): unknown | null {
  try {
    const parsed = JSON.parse(json);

    // Recursively sanitize object keys
    const sanitize = (obj: unknown): unknown => {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(sanitize);
      return sanitizeObjectKeys(obj as Record<string, unknown>);
    };

    return sanitize(parsed);
  } catch {
    return null;
  }
}
