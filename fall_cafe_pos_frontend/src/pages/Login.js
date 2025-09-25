import React, { useState } from "react";
import { theme } from "../theme";
import { signInWithEmailPassword } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Login() {
  /**
   * Login page allowing staff to authenticate
   * If Supabase env not set, login will mock-success.
   */
  const [email, setEmail] = useState("barista@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { data, error } = await signInWithEmailPassword(email, password);
    if (error) {
      setError(error.message || "Login failed");
    } else {
      setUser(data?.user || { email }); // mock fallback
      navigate("/orders");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>🍁</div>
        <div style={styles.title}>Autumn Brew POS</div>
        <div style={styles.sub}>Sign in to continue</div>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              type="email"
              placeholder="you@cafe.com"
              required
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              type="password"
              placeholder="••••••••"
              required
            />
          </label>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submit}>Sign In</button>
        </form>
        <div style={styles.note}>
          Tip: Without Supabase credentials, this will mock-login.
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: theme.colors.background,
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 14,
    boxShadow: theme.elevation.lg,
    padding: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${theme.colors.primary}1A, ${theme.colors.secondary}1A)`,
    display: "grid",
    placeItems: "center",
    fontSize: 28,
    marginBottom: 12,
  },
  title: { fontWeight: 800, fontSize: 20, color: theme.colors.text },
  sub: { color: theme.colors.subtleText, marginTop: 2, marginBottom: 16 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 12, color: theme.colors.subtleText, fontWeight: 600 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${theme.colors.outline}`,
    marginTop: 6,
    outline: "none",
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    background: "#FEE2E2",
    border: "1px solid #FCA5A5",
    padding: "8px 10px",
    borderRadius: 8,
  },
  submit: {
    background: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: 6,
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: theme.colors.subtleText,
  },
};
