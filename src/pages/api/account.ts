import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from '../../lib/auth';

export const POST: APIRoute = async (context) => {
  const { request, cookies, redirect } = context;

  const session = cookies.get('session')?.value;
  if (!session) return redirect('/login');

  const userId = session.replace('user-', '');

  const formData = await request.formData();
  const action = formData.get('action')?.toString();

  if (!import.meta.env.DATABASE_URL) {
    return redirect('/account?error=Error+de+conexión');
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    if (action === 'profile') {
      const email = formData.get('email')?.toString().trim();

      if (!email) {
        return redirect('/account?error=El+correo+es+requerido');
      }

      // Check if email is taken by another user
      const existing = await sql`SELECT id FROM users WHERE email = ${email} AND id != ${userId} LIMIT 1`;
      if (existing.length > 0) {
        return redirect('/account?error=Ese+correo+ya+está+en+uso');
      }

      await sql`UPDATE users SET email = ${email} WHERE id = ${userId}`;
      return redirect('/account?success=Datos+actualizados');

    } else if (action === 'password') {
      const currentPassword = formData.get('current_password')?.toString();
      const newPassword = formData.get('new_password')?.toString();
      const confirmPassword = formData.get('confirm_password')?.toString();

      if (!currentPassword || !newPassword || !confirmPassword) {
        return redirect('/account?error=Todos+los+campos+de+contraseña+son+requeridos');
      }

      if (newPassword !== confirmPassword) {
        return redirect('/account?error=Las+contraseñas+nuevas+no+coinciden');
      }

      if (newPassword.length < 8) {
        return redirect('/account?error=La+contraseña+debe+tener+al+menos+8+caracteres');
      }

      const result = await sql`SELECT password_hash FROM users WHERE id = ${userId} LIMIT 1`;
      if (result.length === 0) {
        return redirect('/account?error=Usuario+no+encontrado');
      }

      const { verifyPassword } = await import('../../lib/auth');
      const valid = await verifyPassword(currentPassword, result[0].password_hash);
      if (!valid) {
        return redirect('/account?error=Contraseña+actual+incorrecta');
      }

      const newHash = await hashPassword(newPassword);
      await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${userId}`;
      return redirect('/account?success=Contraseña+actualizada');

    } else {
      return redirect('/account?error=Acción+no+válida');
    }
  } catch (e) {
    console.error('Account update error:', e);
    return redirect('/account?error=Error+al+guardar+los+cambios');
  }
};
