/**
 * Configuration validation utilities
 * @module config/validation
 */

import { z } from 'zod';

/**
 * Environment validation schema with comprehensive checks
 */
export const envSchema = z.object({
  // Required public keys
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z
    .string()
    .min(32, 'WalletConnect Project ID must be at least 32 characters')
    .regex(/^[a-f0-9]+$/, 'WalletConnect Project ID must be hexadecimal'),

  // Required private keys (server-side only)
  COVALENT_API_KEY: z
    .string()
    .min(10, 'Covalent API key is required')
    .startsWith('cqt_', 'Covalent API key must start with cqt_'),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url('Must be a valid URL').default('http://localhost:3000'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Feature flags (boolean transforms)
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),

  NEXT_PUBLIC_ENABLE_SENTRY: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),

  NEXT_PUBLIC_ENABLE_DEBUG: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),

  // Optional configuration
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_CUSTOM_RPC_URLS: z.string().optional(),

  // Rate limiting
  API_RATE_LIMIT: z.string().transform(Number).pipe(z.number().int().positive()).default('60'),

  API_RATE_WINDOW: z.string().transform(Number).pipe(z.number().int().positive()).default('60000'),

  // Cache configuration
  CACHE_TTL: z.string().transform(Number).pipe(z.number().int().positive()).default('300000'),

  // Development
  NEXT_TELEMETRY_DISABLED: z.string().optional(),
  NEXT_PUBLIC_SHOW_ERRORS: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
});

/**
 * Runtime configuration schema
 */
export const runtimeConfigSchema = z.object({
  app: z.object({
    name: z.string(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    url: z.string().url(),
  }),
  chains: z.object({
    supported: z.array(z.number().int().positive()),
    default: z.number().int().positive(),
  }),
  features: z.record(z.string(), z.boolean()),
  performance: z.object({
    enableCodeSplitting: z.boolean(),
    enableLazyLoading: z.boolean(),
    maxBundleSize: z.number().positive(),
  }),
});

/**
 * Validated environment type
 */
export type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * Validated runtime config type
 */
export type ValidatedRuntimeConfig = z.infer<typeof runtimeConfigSchema>;

/**
 * Validation error formatter
 */
export function formatValidationErrors(errors: z.ZodError): string {
  return errors.errors
    .map((err) => {
      const path = err.path.join('.');
      return `  • ${path}: ${err.message}`;
    })
    .join('\n');
}

/**
 * Safe environment parser with detailed error messages
 */
export function parseEnvironment(env: NodeJS.ProcessEnv): ValidatedEnv {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = formatValidationErrors(error);
      throw new Error(
        `Environment validation failed:\n\n${formatted}\n\n` +
          `Please check your .env.local file and ensure all required variables are set correctly.`
      );
    }
    throw error;
  }
}

/**
 * Validate runtime configuration
 */
export function validateRuntimeConfig(config: unknown): ValidatedRuntimeConfig {
  try {
    return runtimeConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = formatValidationErrors(error);
      throw new Error(`Runtime configuration validation failed:\n\n${formatted}`);
    }
    throw error;
  }
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running on server
 */
export function isServer(): boolean {
  return !isBrowser();
}

/**
 * Safe access to environment variables in browser
 */
export function getPublicEnv(key: string): string | undefined {
  if (isBrowser() && !key.startsWith('NEXT_PUBLIC_')) {
    console.warn(`Attempted to access server-side environment variable "${key}" in browser`);
    return undefined;
  }
  return process.env[key];
}

/**
 * Environment validator class for runtime checks
 */
export class EnvValidator {
  private static instance: EnvValidator;
  private validated: ValidatedEnv | null = null;

  private constructor() {}

  static getInstance(): EnvValidator {
    if (!EnvValidator.instance) {
      EnvValidator.instance = new EnvValidator();
    }
    return EnvValidator.instance;
  }

  validate(): ValidatedEnv {
    if (!this.validated) {
      this.validated = parseEnvironment(process.env);
    }
    return this.validated;
  }

  get(): ValidatedEnv {
    if (!this.validated) {
      this.validate();
    }
    return this.validated!;
  }

  isProduction(): boolean {
    return this.get().NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return this.get().NODE_ENV === 'development';
  }

  isTest(): boolean {
    return this.get().NODE_ENV === 'test';
  }

  reset(): void {
    this.validated = null;
  }
}
