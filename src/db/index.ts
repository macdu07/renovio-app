import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { DATABASE_URL } from 'astro:env/server';

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    if (!DATABASE_URL) {
      console.warn('DATABASE_URL not set - DB operations will not work');
      throw new Error('DATABASE_URL not set');
    }
    const sql = neon(DATABASE_URL);
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
}

export const db = new Proxy({} as any, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  }
});

export type DB = ReturnType<typeof drizzle>;