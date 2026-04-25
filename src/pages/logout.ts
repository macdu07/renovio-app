import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { verifyPassword } from '../lib/auth';
import { users } from '../db/schema';

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return Astro.redirect('/login?error=Correo+y+contraseña+requeridos');
  }

  if (!import.meta.env.DATABASE_URL) {
    return Astro.redirect('/login?error=Error+de+conexión+a+la+base+de+datos');
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

  if (result.length === 0) {
    return Astro.redirect('/login?error=Usuario+no+encontrado');
  }

  const user = result[0];

  const validPassword = await verifyPassword(password, user.password_hash);

  if (!validPassword) {
    return Astro.redirect('/login?error=Contraseña+incorrecta');
  }

  cookies.set('session', `user-${user.id}`, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return Astro.redirect('/');
};