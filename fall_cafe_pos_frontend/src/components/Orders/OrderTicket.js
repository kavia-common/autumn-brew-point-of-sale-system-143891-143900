import React from "react";
import { theme } from "../../theme";

// PUBLIC_INTERFACE
export default function OrderTicket({ items, onIncrement, onDecrement, onRemove }) {
  /**
   * Displays current order items and allows quantity adjustments
   */
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Current Order</div>
        <div style={styles.sub}>Classic Ticket</div>
      </div>
      <div style={styles.body}>
        {items.length === 0 && (
          <div style={styles.empty}>No items added. Select from menu.</div>
        )}
        {items.map((it) => (
          <div key={it.id} style={styles.line}>
            <div style={styles.name}>{it.name}</div>
            <div style={styles.qtyBox}>
              <button style={styles.qtyBtn} onClick={() => onDecrement(it)}>-</button>
              <div style={styles.qty}>{it.qty}</div>
              <button style={styles.qtyBtn} onClick={() => onIncrement(it)}>+</button>
            </div>
            <div style={styles.price}>${(it.price * it.qty).toFixed(2)}</div>
            <button style={styles.remove} onClick={() => onRemove(it)} aria-label="Remove item">
              ✕
            </button>
          </div>
        ))}
      </div>
      <div style={styles.footer}>
        <div style={styles.subtotalLabel}>Subtotal:</div>
        <div style={styles.subtotalValue}>${subtotal.toFixed(2)}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: theme.elevation.md,
    border: `1px solid ${theme.colors.outline}`,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    padding: 12,
    borderBottom: `1px solid ${theme.colors.outline}`,
  },
  title: { fontWeight: 700, color: theme.colors.text },
  sub: { color: theme.colors.subtleText, fontSize: 12 },
  body: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflow: "auto",
  },
  empty: { color: theme.colors.subtleText, fontStyle: "italic" },
  line: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    gap: 8,
    alignItems: "center",
    background: `${theme.colors.secondary}0D`,
    padding: 8,
    borderRadius: 8,
  },
  name: { fontWeight: 600 },
  qtyBox: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: `1px solid ${theme.colors.outline}`,
    background: "#fff",
    cursor: "pointer",
  },
  qty: { minWidth: 20, textAlign: "center" },
  price: { fontWeight: 700, color: theme.colors.text, textAlign: "right" },
  remove: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: 700,
  },
  footer: {
    padding: 12,
    borderTop: `1px solid ${theme.colors.outline}`,
    display: "flex",
    justifyContent: "space-between",
  },
  subtotalLabel: { color: theme.colors.subtleText },
  subtotalValue: { fontWeight: 800 },
};
