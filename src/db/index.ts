import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { getEnvVar } from '../lib/env';

export function getDb(context: any) {
  const dbUrl = getEnvVar(context, 'DATABASE_URL');
  if (!dbUrl) {
    const keys = context?.locals?.runtime?.env ? Object.keys(context.locals.runtime.env).join(', ') : 'no runtime.env';
    throw new Error(`DATABASE_URL not set. Available keys in Cloudflare env: ${keys || 'none'}. Is context.env available? ${!!context?.env}.`);
  }
  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export type DB = ReturnType<typeof drizzle>;