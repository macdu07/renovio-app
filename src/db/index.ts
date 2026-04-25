import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { getEnvVar } from '../lib/env';

export function getDb(context: any) {
  const dbUrl = getEnvVar(context, 'DATABASE_URL');
  if (!dbUrl) {
    console.warn('DATABASE_URL not set - DB operations will not work');
    throw new Error('DATABASE_URL not set');
  }
  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export type DB = ReturnType<typeof drizzle>;