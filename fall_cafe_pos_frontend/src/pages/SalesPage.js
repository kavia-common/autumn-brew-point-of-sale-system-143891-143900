import { useEffect, useState } from 'react';
import { fetchOrders, fetchSalesSummary } from '../services/api';
import { formatCurrency, theme } from '../theme';

/**
 * PUBLIC_INTERFACE
 * SalesPage
 * View revenue KPIs and recent sales tickets.
 */
export default function SalesPage() {
  const [summary, setSummary] = useState({ totalRevenue: 0, count: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchSalesSummary().then(setSummary);
    fetchOrders(50).then(setOrders);
  }, []);

  const styles = getStyles();

  return (
    <div style={styles.wrap}>
      <div style={styles.kpis}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Total Revenue</div>
          <div style={styles.kpiValue}>{formatCurrency(summary.totalRevenue)}</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Orders</div>
          <div style={styles.kpiValue}>{summary.count}</div>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <div style={styles.tableHeader}>
          <div style={{ ...styles.cell, flex: 2 }}>Order ID</div>
          <div style={styles.cell}>Items</div>
          <div style={styles.cell}>Total</div>
          <div style={styles.cell}>Created</div>
          <div style={styles.cell}>Status</div>
        </div>
        <div>
          {orders.map(o => (
            <div key={o.id} style={styles.row}>
              <div style={{ ...styles.cell, flex: 2, fontFamily: 'monospace' }}>{o.id}</div>
              <div style={styles.cell}>{(o.items || []).reduce((acc, l) => acc + (l.qty || 0), 0)}</div>
              <div style={styles.cell}>{formatCurrency(o.total)}</div>
              <div style={styles.cell}>{new Date(o.created_at).toLocaleString()}</div>
              <div style={styles.cell}><span style={styles.badge}>{o.status || 'paid'}</span></div>
            </div>
          ))}
          {orders.length === 0 && <div style={{ padding: 12, color: 'rgba(17,24,39,0.7)', fontStyle: 'italic' }}>No recent orders to show.</div>}
        </div>
      </div>
    </div>
  );
}

function getStyles() {
  return {
    wrap: {
      display: 'grid',
      gap: 12
    },
    kpis: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 12
    },
    kpiCard: {
      background: 'white',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 12,
      boxShadow: theme.colors.shadow
    },
    kpiLabel: { color: 'rgba(17,24,39,0.7)', fontWeight: 700 },
    kpiValue: { fontSize: 22, fontWeight: 800, marginTop: 4 },

    tableWrap: {
      background: 'white',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: theme.colors.shadow
    },
    tableHeader: {
      display: 'flex',
      background: 'rgba(30,58,138,0.06)',
      padding: '10px 12px',
      borderBottom: `1px solid ${theme.colors.subtleBorder}`,
      fontWeight: 800
    },
    row: {
      display: 'flex',
      padding: '10px 12px',
      borderBottom: `1px solid ${theme.colors.subtleBorder}`
    },
    cell: { flex: 1 },
    badge: {
      padding: '2px 8px',
      borderRadius: 999,
      background: 'rgba(245,158,11,0.2)',
      border: `1px solid ${theme.colors.subtleBorder}`,
      fontWeight: 800
    }
  };
}
