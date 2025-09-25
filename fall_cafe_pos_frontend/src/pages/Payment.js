import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../theme";

// PUBLIC_INTERFACE
export default function Payment() {
  /**
   * Payment page to handle tender and complete transactions
   * This is mocked for now and will simulate success.
   */
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize items from location state to avoid changing reference each render
  const items = useMemo(() => location.state?.orderItems || [], [location.state?.orderItems]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const [paid, setPaid] = useState(total.toFixed(2));
  const change = Math.max(0, (parseFloat(paid || "0") - total).toFixed(2));

  const complete = () => {
    // mock success then navigate to orders
    alert("Payment completed successfully!");
    navigate("/orders");
  };

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Payment</div>
            <div style={styles.sub}>Finalize transaction</div>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <div style={styles.section}>Order Summary</div>
            <div style={styles.card}>
              {items.length === 0 && (
                <div style={styles.empty}>No items in order.</div>
              )}
              {items.map((it) => (
                <div key={it.id} style={styles.line}>
                  <div>{it.name} × {it.qty}</div>
                  <div style={{ fontWeight: 700 }}>
                    ${(it.price * it.qty).toFixed(2)}
                  </div>
                </div>
              ))}
              <div style={styles.sep} />
              <div style={styles.line}>
                <div>Subtotal</div>
                <div>${subtotal.toFixed(2)}</div>
              </div>
              <div style={styles.line}>
                <div>Tax</div>
                <div>${tax.toFixed(2)}</div>
              </div>
              <div style={styles.lineTotal}>
                <div>Total</div>
                <div style={{ fontWeight: 800 }}>${total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div style={styles.col}>
            <div style={styles.section}>Tender</div>
            <div style={styles.card}>
              <label style={styles.label}>
                Paid Amount
                <input
                  type="number"
                  step="0.01"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                  style={styles.input}
                />
              </label>
              <div style={styles.changeRow}>
                <div>Change</div>
                <div style={{ fontWeight: 800 }}>${change}</div>
              </div>
              <button style={styles.payBtn} onClick={complete}>
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 16,
    background: theme.colors.background,
    minHeight: "calc(100vh - 64px)",
  },
  panel: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 12,
    boxShadow: theme.elevation.sm,
    padding: 12,
  },
  header: {
    borderBottom: `1px solid ${theme.colors.outline}`,
    paddingBottom: 8,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
  },
  title: { fontWeight: 800 },
  sub: { color: theme.colors.subtleText, fontSize: 12, marginTop: 2 },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  col: { display: "flex", flexDirection: "column", gap: 8 },
  section: { fontWeight: 700, color: theme.colors.text },
  card: {
    background: "#fff",
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 12,
    boxShadow: theme.elevation.sm,
    padding: 12,
  },
  empty: { color: theme.colors.subtleText, fontStyle: "italic" },
  line: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
  },
  sep: {
    height: 1,
    background: theme.colors.outline,
    margin: "8px 0",
  },
  lineTotal: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTop: `1px solid ${theme.colors.outline}`,
  },
  label: { fontSize: 12, color: theme.colors.subtleText, fontWeight: 600 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${theme.colors.outline}`,
    marginTop: 6,
    outline: "none",
  },
  changeRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
    borderTop: `1px solid ${theme.colors.outline}`,
  },
  payBtn: {
    marginTop: 12,
    background: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
