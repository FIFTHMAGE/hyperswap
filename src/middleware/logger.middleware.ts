/**
 * Logging middleware
 * @module middleware
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Logger middleware
 */
export function loggerMiddleware(request: NextRequest) {
  const start = Date.now();

  const response = NextResponse.next();

  response.headers.set('X-Request-Id', crypto.randomUUID());

  const duration = Date.now() - start;

  // eslint-disable-next-line no-console
  console.log({
    method: request.method,
    url: request.url,
    status: response.status,
    duration: `${duration}ms`,
    userAgent: request.headers.get('user-agent'),
  });

  return response;
}
