import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export async function getDb() {
  let dbUrl: string | undefined;

  // Astro v6 + Cloudflare: read from cloudflare:workers env
  try {
    // @ts-ignore
    const { env } = await import('cloudflare:workers');
    dbUrl = env?.DATABASE_URL;
  } catch (e) {
    // Not in Cloudflare runtime
  }

  // Fallback: local dev via Vite
  if (!dbUrl) {
    try {
      dbUrl = import.meta.env.DATABASE_URL;
    } catch (e) {}
  }

  if (!dbUrl) {
    throw new Error('DATABASE_URL not set');
  }

  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export type DB = ReturnType<typeof drizzle>;