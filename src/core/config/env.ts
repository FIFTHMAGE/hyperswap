/**
 * Environment variable parser and validator
 * @module config/env
 */

import { z } from 'zod';

/**
 * Environment variable schema
 */
const envSchema = z.object({
  // Required variables
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, 'WalletConnect Project ID is required'),
  COVALENT_API_KEY: z.string().min(1, 'Covalent API key is required'),

  // Optional variables with defaults
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_ENABLE_SENTRY: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Optional configuration
  NEXT_PUBLIC_CUSTOM_RPC_URLS: z.string().optional(),
  API_RATE_LIMIT: z.string().transform(Number).default('60'),

  // Development
  NEXT_TELEMETRY_DISABLED: z.string().optional(),
  NEXT_PUBLIC_SHOW_ERRORS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

/**
 * Parsed and validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');

      throw new Error(
        `Invalid environment variables:\n${missingVars}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 */
let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development';
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return getEnv().NODE_ENV === 'test';
}

/**
 * Get custom RPC URLs as array
 */
export function getCustomRpcUrls(): string[] {
  const urls = getEnv().NEXT_PUBLIC_CUSTOM_RPC_URLS;
  return urls ? urls.split(',').map((url) => url.trim()) : [];
}
