//
// Supabase client initialization and helpers
//
import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a configured Supabase client using environment variables.
   * Requires:
   * - REACT_APP_SUPABASE_URL
   * - REACT_APP_SUPABASE_KEY
   */
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    console.warn(
      "Supabase environment variables are not set. The app will use mock data. Please provide REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY."
    );
    // Return a stub with minimal interface to avoid runtime errors
    return null;
  }

  return createClient(url, key);
}

// PUBLIC_INTERFACE
export async function signInWithEmailPassword(email, password) {
  /**
   * Signs in a user using Supabase auth with email/password.
   * On environments without Supabase creds, returns a mock success.
   */
  const supabase = getSupabaseClient();
  if (!supabase) {
    // Mock auth success
    return { data: { user: { email } }, error: null };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// PUBLIC_INTERFACE
export async function signOut() {
  /**
   * Signs out the current session.
   */
  const supabase = getSupabaseClient();
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

// PUBLIC_INTERFACE
export async function getCurrentUser() {
  /**
   * Returns the current authenticated user (mocked if Supabase is not configured).
   */
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: { user: null } };
  }
  const { data } = await supabase.auth.getUser();
  return { data };
}
