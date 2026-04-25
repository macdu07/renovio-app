import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { DATABASE_URL } from 'astro:env/server';

function createDb() {
  if (!DATABASE_URL) {
    console.warn('DATABASE_URL not set - DB operations will not work');
    return null;
  }
  const sql = neon(DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = createDb();
export type DB = typeof db;