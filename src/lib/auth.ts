/** biome-ignore-all lint/style/noMagicNumbers: times and dates */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { twoFactor } from 'better-auth/plugins';
import { db } from './db';
import { sendOTP } from './email';
import { env } from './env';
import { logger } from './logger';
// biome-ignore lint/performance/noNamespaceImport: Required for Drizzle schema
import * as schema from './schema';

export const auth = betterAuth({
  appName: 'Oryx',
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  rateLimit: {
    window: 60,
    max: 100,
    storage: 'memory',
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      twoFactor: schema.twoFactor,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
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
    defaultCookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [
    nextCookies(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          try {
            await sendOTP(user.email, otp);
            console.log(`✅ OTP sent successfully to ${user.email}`);
          } catch (error) {
            console.error(`❌ Failed to send OTP to ${user.email}:`, error);
            throw error;
          }
        },
      },
      // Skip 2FA verification on enable for development ease
      skipVerificationOnEnable: process.env.NODE_ENV === 'development',
    }),
  ],
  secret: env.BETTER_AUTH_SECRET,
});

logger.setContext('Auth').info('Better Auth initialized successfully', {
  hasSecret: !!env.BETTER_AUTH_SECRET,
  secretLength: env.BETTER_AUTH_SECRET?.length || 0,
  hasGoogleCredentials: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
});
