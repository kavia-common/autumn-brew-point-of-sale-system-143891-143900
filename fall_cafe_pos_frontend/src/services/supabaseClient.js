import { createClient } from '@supabase/supabase-js';
import { getURL } from './getURL';

/**
 * PUBLIC_INTERFACE
 * getSupabase
 * Returns a singleton Supabase client configured using environment variables.
 */
let supabaseInstance = null;

/**
 * Reduce a full URL to a safe, non-sensitive host string for logging.
 * Examples:
 *  - https://your-project.supabase.co -> your-project.supabase.co
 *  - http://localhost:54321 -> localhost
 */
function redactHost(inputUrl) {
  try {
    const u = new URL(inputUrl);
    // Return hostname only (no protocol, no path, no port in logs)
    return u.hostname || 'unknown-host';
  } catch {
    // If URL constructor fails, attempt a naive strip of protocol
    if (!inputUrl) return 'unset';
    return String(inputUrl).replace(/^https?:\/\//i, '').split('/')[0];
  }
}

function validateEnv() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Supabase] Missing environment variables. Expected REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY. ' +
      'Using no-op client; app will fall back to local reads and may not persist data.'
    );
  }
  return { url: url || '', key: key || '' };
}

/**
 * Build a safe no-op Supabase-like client that throws controlled errors.
 * This prevents hard crashes when env is not present and allows api.js to fallback.
 */
function makeNoopSupabase() {
  const errorFn = () => ({
    select: () => ({ order: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    order: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
    upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
    eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    limit: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
  });
  return {
    auth: {
      getSession: async () => ({ data: null, error: new Error('Supabase not configured') })
    },
    from: () => errorFn()
  };
}

// PUBLIC_INTERFACE
export function getSupabase() {
  /** Returns a singleton Supabase client configured using env variables. */
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = validateEnv();

  // If missing or invalid, return a safe no-op client to avoid crashing at runtime
  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.info('[Supabase] Using no-op client (env missing).');
    supabaseInstance = makeNoopSupabase();
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        // This prepares for future email/OAuth flows. Redirects must be allowlisted in Supabase.
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    });
    // eslint-disable-next-line no-console
    console.info(`[Supabase] Client initialized for host: ${redactHost(url)}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[Supabase] Failed to create client. Falling back to no-op:', e?.message || e);
    supabaseInstance = makeNoopSupabase();
  }
  return supabaseInstance;
}

// PUBLIC_INTERFACE
export function getAuth() {
  /** Returns the Supabase auth interface */
  return getSupabase().auth;
}

// OPTIONAL HELPERS FOR FUTURE AUTH FLOWS
export const authRedirects = {
  callback: () => `${getURL()}auth/callback`,
  resetPassword: () => `${getURL()}auth/reset-password`,
};
