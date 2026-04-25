import { defineMiddleware } from 'astro:middleware';

const publicPaths = ['/login', '/api/login', '/api/logout'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return next();
  }

  const session = context.cookies.get('session')?.value;

  if (!session) {
    return context.redirect('/login');
  }

  return next();
});