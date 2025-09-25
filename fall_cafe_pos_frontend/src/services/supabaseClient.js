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

// PUBLIC_INTERFACE
export function getSupabase() {
  /** Returns a singleton Supabase client configured using env variables. */
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = validateEnv();

  supabaseInstance = createClient(url, key, {
    auth: {
      // This prepares for future email/OAuth flows. Redirects must be allowlisted in Supabase.
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  });
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
