import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from '../src/db/schema';

const encoder = new TextEncoder();

async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createAdminUser() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema: { users } });

  const email = 'maocorread.@gmail.com';
  const password = 'Mcd285825*';
  const passwordHash = await hashPassword(password);

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length > 0) {
    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    console.log('Admin user updated:', email);
  } else {
    await db.insert(users).values({
      email,
      passwordHash,
      role: 'admin',
    });
    console.log('Admin user created:', email);
  }
}

createAdminUser();