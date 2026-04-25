import { defineMiddleware } from 'astro:middleware';

const publicPaths = ['/login', '/api/login', '/api/logout'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Capture CF runtime env safely HERE (before the getter can throw in page context)
  // In CF Pages production, this is the right place to read env bindings.
  try {
    const runtime = (context.locals as any).runtime;
    if (runtime) {
      // Access .env inside try so any getter error is caught
      const cfEnv = runtime.env;
      (context.locals as any).cfEnv = cfEnv ?? {};
    }
  } catch (_) {
    (context.locals as any).cfEnv = {};
  }

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