import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env';
import { logger } from './logger';
// biome-ignore lint/performance/noNamespaceImport: Required for Drizzle schema
import * as schema from './schema';

const REGEX_URL = /\/\/.*@/;

const client = postgres(env.DATABASE_URL, {
  max: 1, // Maximum number of connections
  // biome-ignore lint/suspicious/noEmptyBlockStatements: hmmm..
  onnotice: () => {},
});

export const db = drizzle(client, { schema });
export { client };

if (typeof window === 'undefined') {
  (async () => {
    try {
      await client`SELECT 1 as test`;
      logger
        .setContext('Database')
        .info('Database connection established successfully');

      const tables = await client`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('user', 'session', 'account', 'verification')
      `;

      logger.setContext('Database').info('Database tables check', {
        // biome-ignore lint/suspicious/noExplicitAny: hmm...
        foundTables: tables.map((row: any) => row.table_name),
        expectedTables: ['user', 'session', 'account', 'verification'],
      });
    } catch (error) {
      logger.setContext('Database').error('Database connection failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: env.DATABASE_URL.replace(REGEX_URL, '//***:***@'),
      });
    }
  })();
}
