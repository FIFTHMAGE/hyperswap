/**
 * Environment validation on app startup
 * @module lib/env-validation
 */

import { validateEnv } from '@/config/env';

/**
 * Validate environment variables on app startup
 * This will throw an error if required env vars are missing
 */
export function initializeEnv() {
  if (typeof window === 'undefined') {
    // Server-side validation
    try {
      validateEnv();
      console.log('✓ Environment variables validated successfully');
    } catch (error) {
      console.error('✗ Environment validation failed:');
      console.error(error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  initializeEnv();
}
