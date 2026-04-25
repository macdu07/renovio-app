import type { APIRoute } from 'astro';

// GET handler: ClientRouter may prefetch this URL — just redirect to login
export const GET: APIRoute = async ({ redirect }) => {
  return redirect('/login');
};

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('session', { path: '/' });
  return redirect('/login');
};
