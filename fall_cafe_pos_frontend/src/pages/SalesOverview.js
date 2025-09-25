import React, { useMemo, useState } from "react";
import { theme } from "../theme";
import { mockSales } from "../services/mockData";

// PUBLIC_INTERFACE
export default function SalesOverview() {
  /**
   * Sales overview: simple analytics snapshot using mock data
   * Future: fetch from Supabase analytics table
   */
  const [days] = useState(mockSales);

  const totals = useMemo(() => {
    const totalSales = days.reduce((sum, d) => sum + d.total, 0);
    const totalItems = days.reduce((sum, d) => sum + d.items, 0);
    const avgTicket = totalItems ? totalSales / totalItems : 0;
    return { totalSales, totalItems, avgTicket };
  }, [days]);

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.title}>Sales Overview</div>
          <div style={styles.sub}>Performance snapshot</div>
        </div>

        <div style={styles.kpis}>
          <div style={styles.kpi}>
            <div style={styles.kpiLabel}>Total Sales</div>
            <div style={styles.kpiValue}>${totals.totalSales.toFixed(2)}</div>
          </div>
          <div style={styles.kpi}>
            <div style={styles.kpiLabel}>Items Sold</div>
            <div style={styles.kpiValue}>{totals.totalItems}</div>
          </div>
          <div style={styles.kpi}>
            <div style={styles.kpiLabel}>Avg Ticket</div>
            <div style={styles.kpiValue}>${totals.avgTicket.toFixed(2)}</div>
          </div>
        </div>

        <div style={styles.list}>
          {days.map((d) => (
            <div key={d.id} style={styles.row}>
              <div style={{ fontWeight: 700 }}>{d.date}</div>
              <div>Items: {d.items}</div>
              <div style={{ fontWeight: 700 }}>${d.total.toFixed(2)}</div>
            </div>
          ))}
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
  },
  title: { fontWeight: 800 },
  sub: { color: theme.colors.subtleText, fontSize: 12, marginTop: 2 },
  kpis: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  kpi: {
    background: "#fff",
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 12,
    padding: 12,
    boxShadow: theme.elevation.sm,
  },
  kpiLabel: { color: theme.colors.subtleText, fontSize: 12 },
  kpiValue: { fontWeight: 800, fontSize: 20, marginTop: 6 },
  list: { display: "flex", flexDirection: "column", gap: 8, marginTop: 12 },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    alignItems: "center",
    background: "#fff",
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 10,
    padding: "8px 10px",
  },
};
