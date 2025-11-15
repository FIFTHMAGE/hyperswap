/**
 * Rate limiting middleware
 * @module middleware
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(request: NextRequest, limit = 100, windowMs = 60000) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return NextResponse.next();
  }

  if (store[key].count >= limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((store[key].resetTime - now) / 1000)),
        },
      }
    );
  }

  store[key].count++;
  return NextResponse.next();
}

/**
 * Clear expired entries from store
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}
