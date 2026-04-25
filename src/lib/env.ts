// Reads env vars from:
// 1. context.locals.cfEnv  — captured from CF runtime by middleware (production)
// 2. import.meta.env       — Vite local dev fallback
//
// Usage:
//   In .astro pages:     getEnvVar(Astro, 'KEY')
//   In API routes:       getEnvVar(context, 'KEY')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEnvVar(context: any, key: string): string | undefined {
  // 1. CF runtime env captured by middleware (safe, no throwing getter)
  const cfEnv = context?.locals?.cfEnv;
  if (cfEnv && cfEnv[key]) return cfEnv[key];

  // 2. Vite / local dev fallback
  try {
    if (import.meta.env?.[key]) return import.meta.env[key];
  } catch (_) {}

  return undefined;
}
