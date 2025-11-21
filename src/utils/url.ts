/**
 * URL Utilities
 * Helper functions for URL parsing and manipulation
 */

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};

  if (!queryString) {
    return params;
  }

  // Remove leading ? if present
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  cleanQuery.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  });

  return params;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

/**
 * Add query parameters to URL
 */
export function addQueryParams(
  url: string,
  params: Record<string, string | number | boolean>
): string {
  const queryString = buildQueryString(params);
  const separator = url.includes('?') ? '&' : '';
  return `${url}${separator}${queryString.replace('?', '')}`;
}

/**
 * Get query parameter from URL
 */
export function getQueryParam(url: string, param: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(param);
  } catch {
    return null;
  }
}

/**
 * Remove query parameter from URL
 */
export function removeQueryParam(url: string, param: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(param);
    return urlObj.toString();
  } catch {
    return url;
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
 * Get domain from URL
 */
export function getDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Get path from URL
 */
export function getPath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return null;
  }
}

/**
 * Join URL paths
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      // Remove leading slash from all but first
      if (index > 0 && path.startsWith('/')) {
        path = path.slice(1);
      }
      // Remove trailing slash from all but last
      if (index < paths.length - 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      return path;
    })
    .filter((path) => path.length > 0)
    .join('/');
}

/**
 * Sanitize URL for display
 */
export function sanitizeUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;

    if (domain.length + path.length <= maxLength) {
      return `${domain}${path}`;
    }

    const truncatedPath = path.slice(0, maxLength - domain.length - 3) + '...';
    return `${domain}${truncatedPath}`;
  } catch {
    return url.slice(0, maxLength - 3) + '...';
  }
}

/**
 * Check if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Convert relative URL to absolute
 */
export function toAbsoluteUrl(url: string, baseUrl: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

/**
 * Extract hash from URL
 */
export function getHash(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hash ? urlObj.hash.slice(1) : null;
  } catch {
    return null;
  }
}

/**
 * Build blockchain explorer URL
 */
export function buildExplorerUrl(
  type: 'address' | 'tx' | 'token' | 'block',
  value: string,
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' = 'ethereum'
): string {
  const explorers: Record<string, string> = {
    ethereum: 'https://etherscan.io',
    polygon: 'https://polygonscan.com',
    bsc: 'https://bscscan.com',
    arbitrum: 'https://arbiscan.io',
  };

  const baseUrl = explorers[network] || explorers.ethereum;

  switch (type) {
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    case 'block':
      return `${baseUrl}/block/${value}`;
    default:
      return baseUrl;
  }
}

/**
 * Shorten URL for display
 */
export function shortenUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname !== '/' ? '/...' : ''}`;
  } catch {
    return url;
  }
}

/**
 * Check if URLs match (ignoring query params and hash)
 */
export function urlsMatch(url1: string, url2: string): boolean {
  try {
    const obj1 = new URL(url1);
    const obj2 = new URL(url2);

    return (
      obj1.protocol === obj2.protocol &&
      obj1.hostname === obj2.hostname &&
      obj1.pathname === obj2.pathname &&
      obj1.port === obj2.port
    );
  } catch {
    return false;
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
