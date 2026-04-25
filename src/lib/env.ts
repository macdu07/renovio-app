// Simple env var reader for Node.js (Coolify / standard server).
// Reads from process.env (set via Coolify dashboard or .env file).
// Signature keeps context param for API compatibility (unused in Node).
//
// Usage:
//   In .astro pages:     getEnvVar(Astro, 'KEY')
//   In API routes:       getEnvVar(context, 'KEY')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEnvVar(_context: any, key: string): string | undefined {
  // Node.js: process.env is the standard way
  if (typeof process !== 'undefined' && process.env[key]) {
    return process.env[key];
  }

  // Vite build-time fallback (local dev with import.meta.env)
  try {
    if (import.meta.env?.[key]) return import.meta.env[key];
  } catch (_) {}

  return undefined;
}
