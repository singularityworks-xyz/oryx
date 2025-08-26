import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import { env } from './env';
import { logger } from './logger';
// biome-ignore lint/performance/noNamespaceImport: Required for Drizzle schema
import * as schema from './schema';

export const auth = betterAuth({
  rateLimit: {
    window: 60,
    max: 100,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: 'select_account',
            accessType: 'offline',
          },
        }
      : {},
  advanced: {
    cookiePrefix: 'oryx',
  },
  plugins: [nextCookies()],
  secret: env.BETTER_AUTH_SECRET,
});

logger.setContext('Auth').info('Better Auth initialized successfully', {
  hasSecret: !!env.BETTER_AUTH_SECRET,
  secretLength: env.BETTER_AUTH_SECRET?.length || 0,
  hasGoogleCredentials: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
});
