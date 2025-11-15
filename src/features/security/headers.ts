export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function applySecurityHeaders(headers: Headers): Headers {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return headers;
}

export const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.walletconnect.com https://*.covalenthq.com;
  frame-src 'self' https://*.walletconnect.com;
`.replace(/\s{2,}/g, ' ').trim();

