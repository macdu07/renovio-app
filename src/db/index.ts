import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { getEnvVar } from '../lib/env';

// Pass the Astro context (or API context) so getEnvVar can read from
// context.locals.runtime.env in Cloudflare, or import.meta.env in local dev.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(context: any) {
  const dbUrl = getEnvVar(context, 'DATABASE_URL');

  if (!dbUrl) {
    throw new Error('DATABASE_URL not set');
  }

  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export type DB = ReturnType<typeof drizzle>;