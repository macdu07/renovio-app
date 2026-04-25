import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// In Node.js (Coolify), process.env is always available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(_context?: any) {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL not set — add it to your Coolify environment variables.');
  }

  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export type DB = ReturnType<typeof drizzle>;