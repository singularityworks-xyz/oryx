import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import { env } from './env';
import { logger } from './logger';
// biome-ignore lint/performance/noNamespaceImport: hmmm..
import * as schema from './schema';

export const auth = betterAuth({
  database: {
    db,
    type: 'drizzle',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  },
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
