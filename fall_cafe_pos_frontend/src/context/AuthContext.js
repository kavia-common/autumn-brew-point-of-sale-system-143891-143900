import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../services/supabaseClient";

// Simple auth context to share user session across the app

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and methods */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state for the app */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await getCurrentUser();
        if (mounted) {
          setUser(data?.user ?? null);
        }
      } catch (e) {
        console.warn("Auth init error (using mock if no Supabase):", e);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    signOut: async () => {
      await signOut();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
