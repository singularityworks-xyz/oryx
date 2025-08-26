import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import { env } from './env';
import { logger } from './logger';
// biome-ignore lint/performance/noNamespaceImport: Required for Drizzle schema
import * as schema from './schema';

export const auth = betterAuth({
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
  plugins: [nextCookies()],
  secret: env.BETTER_AUTH_SECRET,
});

logger.setContext('Auth').info('Better Auth initialized successfully', {
  hasSecret: !!env.BETTER_AUTH_SECRET,
  secretLength: env.BETTER_AUTH_SECRET?.length || 0,
});
