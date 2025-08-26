import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { logger } from './logger';

const MIN_SECRET_LENGTH = 32;

export const env = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',

  server: {
    DATABASE_URL: z.url({ message: 'DATABASE_URL must be a valid URL' }),
    BETTER_AUTH_SECRET: z
      .string()
      .min(
        MIN_SECRET_LENGTH,
        `BETTER_AUTH_SECRET must be at least ${MIN_SECRET_LENGTH} characters`
      ),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    BETTER_AUTH_URL: z.url().optional(),

    LOG_LEVEL: z
      .enum(['debug', 'info', 'warn', 'error', 'none'])
      .default('info'),
    LOG_STRUCTURED: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    LOG_DISABLE_CONSOLE: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    LOG_ENABLE_EXTERNAL: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    LOG_SERVICE_URL: z.url().optional(),
    LOG_SERVICE_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_STRUCTURED: process.env.LOG_STRUCTURED,
    LOG_DISABLE_CONSOLE: process.env.LOG_DISABLE_CONSOLE,
    LOG_ENABLE_EXTERNAL: process.env.LOG_ENABLE_EXTERNAL,
    LOG_SERVICE_URL: process.env.LOG_SERVICE_URL,
    LOG_SERVICE_API_KEY: process.env.LOG_SERVICE_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED:
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED,
  },

  onValidationError: (error: unknown) => {
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as {
        issues: Array<{
          path: (string | number)[];
          message: string;
          code?: string;
        }>;
      };
      const errorsForLog = zodError.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));

      logger.setContext('Environment').error('Environment validation failed', {
        errors: errorsForLog,
      });
    } else {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Environment validation failed';

      logger.setContext('Environment').error('Environment validation failed', {
        error: errorMessage,
      });
    }

    throw new Error(
      'Environment validation failed. Check your environment variables.'
    );
  },

  onInvalidAccess: (variable: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Environment] Attempted to access server-side variable "${variable}" on client. This is usually safe to ignore during development.`
      );
      return undefined as never;
    }

    logger.setContext('Environment').error('Invalid environment access', {
      variable,
      error: 'Attempted to access server-side environment variable on client',
    });

    throw new Error(
      `Attempted to access server-side environment variable "${variable}" on client`
    );
  },
});

if (typeof window === 'undefined') {
  logger
    .setContext('Environment')
    .info('Environment variables validated successfully', {
      nodeEnv: env.NODE_ENV,
      hasDatabaseUrl: !!env.DATABASE_URL,
      hasBetterAuthSecret: !!env.BETTER_AUTH_SECRET,
      logLevel: env.LOG_LEVEL,
    });
}

// Export convenience functions for backward compatibility
export const getServerEnv = () => env;
export const getClientEnv = () => ({
  // Client variables are automatically available in the browser
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

// Export types for use throughout the app
export type ServerEnv = typeof env;
export type ClientEnv = ReturnType<typeof getClientEnv>;
