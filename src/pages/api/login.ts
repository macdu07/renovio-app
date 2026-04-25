import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { verifyPassword } from '../../lib/auth';

async function getCfEnv() {
  try {
    // @ts-ignore
    const { env } = await import('cloudflare:workers');
    return env;
  } catch (e) {
    return import.meta.env;
  }
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/login?error=Correo+y+contraseña+requeridos');
  }

  const cfEnv = await getCfEnv();
  const dbUrl = cfEnv?.DATABASE_URL;

  if (!dbUrl) {
    return redirect('/login?error=Error+de+conexión+a+la+base+de+datos');
  }

  const sql = neon(dbUrl);
  const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

  if (result.length === 0) {
    return redirect('/login?error=Usuario+no+encontrado');
  }

  const user = result[0];
  const validPassword = await verifyPassword(password, user.password_hash);

  if (!validPassword) {
    return redirect('/login?error=Contraseña+incorrecta');
  }

  cookies.set('session', `user-${user.id}`, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return redirect('/');
};