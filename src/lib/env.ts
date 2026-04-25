// Astro v6 + Cloudflare: use 'cloudflare:workers' for runtime env access.
// In local dev, Vite exposes vars via import.meta.env as fallback.
export async function getEnvVar(key: string): Promise<string | undefined> {
  // 1. Try Cloudflare Workers env (production)
  try {
    // @ts-ignore - cloudflare:workers is only available in Cloudflare runtime
    const { env } = await import('cloudflare:workers');
    if (env && env[key]) return env[key];
  } catch (e) {
    // Not in Cloudflare runtime, fall through
  }

  // 2. Fallback: Vite / local dev
  try {
    if (import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {}

  return undefined;
}
