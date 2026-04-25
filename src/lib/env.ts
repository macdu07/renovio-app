export function getEnvVar(context: any, key: string): string | undefined {
  if (context?.locals?.runtime?.env && context.locals.runtime.env[key]) {
    return context.locals.runtime.env[key];
  }
  return import.meta.env[key];
}
