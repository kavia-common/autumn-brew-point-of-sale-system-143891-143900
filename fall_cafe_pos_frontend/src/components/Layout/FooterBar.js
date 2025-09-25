import React from "react";
import { theme } from "../../theme";

// PUBLIC_INTERFACE
export default function FooterBar({ subtotal, taxRate = 0.07, onPay }) {
  /**
   * Footer summarizing current order and providing payment action
   */
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <footer style={styles.footer}>
      <div style={styles.row}>
        <div style={styles.sumBox}>
          <div style={styles.label}>Subtotal</div>
          <div style={styles.value}>${subtotal.toFixed(2)}</div>
        </div>
        <div style={styles.sumBox}>
          <div style={styles.label}>Tax</div>
          <div style={styles.value}>${tax.toFixed(2)}</div>
        </div>
        <div style={{ ...styles.sumBox, borderColor: theme.colors.secondary }}>
          <div style={{ ...styles.label, color: theme.colors.secondary }}>
            Total
          </div>
          <div style={{ ...styles.totalValue }}>${total.toFixed(2)}</div>
        </div>
      </div>
      <button onClick={onPay} style={styles.payBtn} aria-label="Proceed to Payment">
        Proceed to Payment
      </button>
    </footer>
  );
}

const styles = {
  footer: {
    background: theme.colors.surface,
    borderTop: `1px solid ${theme.colors.outline}`,
    height: 80,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: theme.elevation.sm,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  sumBox: {
    border: `1px solid ${theme.colors.outline}`,
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 10,
    minWidth: 120,
  },
  label: {
    fontSize: 12,
    color: theme.colors.subtleText,
    marginBottom: 4,
  },
  value: {
    fontWeight: 700,
    color: theme.colors.text,
  },
  totalValue: {
    fontWeight: 800,
    color: theme.colors.text,
  },
  payBtn: {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent1})`,
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: theme.elevation.md,
  },
};
