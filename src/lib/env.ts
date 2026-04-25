export function getEnvVar(context: any, key: string): string | undefined {
  try {
    if (context?.locals?.runtime?.env && context.locals.runtime.env[key]) {
      return context.locals.runtime.env[key];
    }
  } catch (err) {
    // Getter for runtime.env might throw in certain dev environments
  }
  
  try {
    if (import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (err) {
    // Ignore
  }

  return undefined;
}
