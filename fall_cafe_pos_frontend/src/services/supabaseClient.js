import { createClient } from '@supabase/supabase-js';
import { getURL } from './getURL';

/**
 * PUBLIC_INTERFACE
 * getSupabase
 * Returns a singleton Supabase client configured using environment variables.
 */
let supabaseInstance = null;

function validateEnv() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.warn(
      'Supabase env missing: Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in .env. ' +
      'App will use local fallbacks for read operations and may not persist data.'
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
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Supabase client, falling back to no-op client:', e?.message || e);
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
