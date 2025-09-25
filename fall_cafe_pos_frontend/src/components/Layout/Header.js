import React from "react";
import { theme } from "../../theme";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { path: "/orders", label: "Orders" },
  { path: "/menu", label: "Menu" },
  { path: "/payment", label: "Payment" },
  { path: "/sales", label: "Sales" },
];

export default function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logoCircle}>🍂</div>
        <div>
          <div style={styles.brandTitle}>Autumn Brew POS</div>
          <div style={styles.brandSub}>Classic • Clean • Efficient</div>
        </div>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                color: active ? theme.colors.primary : theme.colors.text,
                borderBottom: active
                  ? `2px solid ${theme.colors.secondary}`
                  : "2px solid transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={styles.userArea}>
        <div style={styles.userText}>
          {user?.email ? user.email : "Guest"}
        </div>
        <button style={styles.outBtn} onClick={signOut} title="Sign out">
          Sign out
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.outline}`,
    height: 64,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: theme.elevation.sm,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.secondary}15)`,
    display: "grid",
    placeItems: "center",
    fontSize: 20,
    boxShadow: theme.elevation.sm,
  },
  brandTitle: {
    fontWeight: 700,
    color: theme.colors.text,
  },
  brandSub: {
    fontSize: 12,
    color: theme.colors.subtleText,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  navLink: {
    textDecoration: "none",
    padding: "8px 4px",
    fontWeight: 600,
  },
  userArea: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  userText: {
    color: theme.colors.subtleText,
    fontSize: 14,
  },
  outBtn: {
    background: theme.colors.primary,
    border: "none",
    color: "white",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    boxShadow: theme.elevation.sm,
  },
};
