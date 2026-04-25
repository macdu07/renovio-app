// Astro v6 + Cloudflare: reads env vars from Cloudflare Workers runtime first,
// then falls back to Vite's import.meta.env for local dev.
//
// Usage:
//   In .astro pages:     getEnvVar(Astro, 'KEY')
//   In API routes:       getEnvVar(context, 'KEY')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEnvVar(context: any, key: string): string | undefined {
  // 1. Cloudflare Workers runtime (production / CF Pages preview)
  //    The adapter's .env getter throws outside the CF runtime, so we must try/catch.
  try {
    const cfEnv = context?.locals?.runtime?.env;
    if (cfEnv && cfEnv[key]) return cfEnv[key];
  } catch (_) {}

  // 2. Vite / local dev
  try {
    if (import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (_) {}

  return undefined;
}
