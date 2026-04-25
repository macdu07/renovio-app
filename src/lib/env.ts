export function getEnvVar(context: any, key: string): string | undefined {
  let val: string | undefined = undefined;

  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      val = process.env[key];
    }
  } catch (e) {}
  if (val) return val;

  try {
    if (context?.locals?.runtime?.env && context.locals.runtime.env[key]) {
      val = context.locals.runtime.env[key];
    }
  } catch (err) {}
  if (val) return val;

  try {
    if (context?.env && context.env[key]) {
      val = context.env[key];
    }
  } catch(e) {}
  if (val) return val;
  
  try {
    if (import.meta.env && import.meta.env[key]) {
      val = import.meta.env[key];
    }
  } catch (err) {}

  return val;
}
