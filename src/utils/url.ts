/**
 * URL Utilities
 * Helper functions for URL parsing, validation, and manipulation
 */

/**
 * Parse query parameters from URL string
 */
export function parseQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  } catch {
    return {};
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean>
): string {
  try {
    const url = new URL(baseUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Extract path from URL
 */
export function extractPath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return null;
  }
}

/**
 * Add or update query parameter
 */
export function setQueryParam(url: string, key: string, value: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Remove query parameter
 */
export function removeQueryParam(url: string, key: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(key);
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Check if URL is HTTP/HTTPS
 */
export function isHttpUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check if URL is localhost
 */
export function isLocalhost(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'localhost' ||
      urlObj.hostname === '127.0.0.1' ||
      urlObj.hostname === '::1'
    );
  } catch {
    return false;
  }
}

/**
 * Normalize URL (remove trailing slash, lowercase protocol/domain)
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let normalized = `${urlObj.protocol.toLowerCase()}//${urlObj.hostname.toLowerCase()}`;

    if (urlObj.port) {
      normalized += `:${urlObj.port}`;
    }

    normalized += urlObj.pathname.replace(/\/$/, '');

    if (urlObj.search) {
      normalized += urlObj.search;
    }

    if (urlObj.hash) {
      normalized += urlObj.hash;
    }

    return normalized;
  } catch {
    return url;
  }
}

/**
 * Join URL paths
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/$/, '');
      }
      return path.replace(/^\/|\/$/g, '');
    })
    .filter(Boolean)
    .join('/');
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Check if URL points to an image
 */
export function isImageUrl(url: string): boolean {
  const extension = getFileExtension(url);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  return extension ? imageExtensions.includes(extension.toLowerCase()) : false;
}

/**
 * Sanitize URL for display (remove sensitive params)
 */
export function sanitizeUrl(
  url: string,
  sensitiveParams: string[] = ['token', 'key', 'secret']
): string {
  try {
    const urlObj = new URL(url);
    sensitiveParams.forEach((param) => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '***');
      }
    });
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Encode URL component safely
 */
export function safeEncodeURIComponent(str: string): string {
  try {
    return encodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Decode URL component safely
 */
export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
