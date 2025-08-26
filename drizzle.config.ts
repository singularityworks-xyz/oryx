import { defineConfig } from 'drizzle-kit';
import { getServerEnv } from './src/lib/env';

const env = getServerEnv();

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
