import React from "react";
import { theme } from "../../theme";

// PUBLIC_INTERFACE
export default function MenuGrid({ items, onAdd }) {
  /**
   * Grid of menu items for selection
   */
  return (
    <div style={styles.grid}>
      {items.map((m) => (
        <button key={m.id} style={styles.card} onClick={() => onAdd(m)}>
          <div style={styles.cardHeader}>
            <div style={styles.badge}>{m.category}</div>
          </div>
          <div style={styles.cardTitle}>{m.name}</div>
          <div style={styles.cardPrice}>${m.price.toFixed(2)}</div>
        </button>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#fff",
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 12,
    padding: 12,
    textAlign: "left",
    boxShadow: theme.elevation.sm,
    cursor: "pointer",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  badge: {
    background: `${theme.colors.primary}10`,
    color: theme.colors.primary,
    border: `1px solid ${theme.colors.primary}33`,
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 700,
  },
  cardTitle: {
    marginTop: 8,
    fontWeight: 700,
    color: theme.colors.text,
  },
  cardPrice: {
    marginTop: 4,
    color: theme.colors.subtleText,
  },
};
