import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(_context?: any) {
  // Production (Coolify/Node): process.env
  // Local dev (Vite SSR): import.meta.env
  const dbUrl =
    process.env.DATABASE_URL ||
    (import.meta as any).env?.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL not set — check your .env file or Coolify environment variables.');
  }

  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export type DB = ReturnType<typeof drizzle>;