import React from "react";
import { theme } from "../../theme";
import { categories } from "../../services/mockData";

// PUBLIC_INTERFACE
export default function Sidebar({ current, onSelect }) {
  /**
   * Sidebar showing categories for order taking
   */
  return (
    <aside style={styles.aside}>
      <div style={styles.title}>Categories</div>
      <div style={styles.list}>
        {categories.map((cat) => {
          const active = current === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              style={{
                ...styles.item,
                background: active ? `${theme.colors.secondary}20` : theme.colors.surface,
                borderColor: active ? theme.colors.secondary : "transparent",
                color: active ? theme.colors.text : theme.colors.text,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

const styles = {
  aside: {
    width: 220,
    minWidth: 220,
    background: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.outline}`,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontWeight: 700,
    color: theme.colors.text,
    padding: "4px 8px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  item: {
    textAlign: "left",
    border: "1px solid",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
};
