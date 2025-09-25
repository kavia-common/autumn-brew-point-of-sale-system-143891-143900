import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabase
 * Returns a singleton Supabase client configured using environment variables.
 */
let supabaseInstance = null;

// PUBLIC_INTERFACE
export function getSupabase() {
  /** Returns a singleton Supabase client configured using env variables. */
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // Provide a clear error to the developer if env is missing.
    // Do not crash the app; features will gracefully degrade with local state.
    // eslint-disable-next-line no-console
    console.warn('Supabase env missing: Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY');
  }

  supabaseInstance = createClient(url || '', key || '');
  return supabaseInstance;
}

// PUBLIC_INTERFACE
export function getAuth() {
  /** Returns the Supabase auth interface */
  return getSupabase().auth;
}
