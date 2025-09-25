import { useEffect, useMemo, useState } from 'react';
import { fetchMenu, saveOrder } from '../services/api';
import { formatCurrency, theme } from '../theme';
import { v4 as uuidv4 } from 'uuid';

/**
 * PUBLIC_INTERFACE
 * OrdersPage
 * Main POS screen for building orders from menu and processing payment.
 */
export default function OrdersPage() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('');
  const [ticket, setTicket] = useState([]);
  const [note, setNote] = useState('');
  const [tendered, setTendered] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCategory(urlParams.get('category') || '');
  }, []);

  useEffect(() => {
    fetchMenu().then(setMenu);
  }, []);

  const categories = useMemo(() => {
    const set = new Set(menu.map(m => m.category || 'Other'));
    return Array.from(set);
  }, [menu]);

  const filtered = useMemo(() => {
    if (!category) return menu;
    return menu.filter(m => (m.category || '') === category);
  }, [menu, category]);

  const totals = useMemo(() => {
    const subtotal = ticket.reduce((acc, l) => acc + l.price * l.qty, 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;
    const tender = Number(tendered || 0);
    const change = tender > 0 ? Math.max(0, tender - total) : 0;
    return { subtotal, tax, total, change };
  }, [ticket, tendered]);

  function addToTicket(item) {
    setTicket(prev => {
      const idx = prev.findIndex(l => l.id === item.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + 1 };
        return clone;
      }
      return [...prev, { id: item.id, name: item.name, price: Number(item.price || 0), qty: 1 }];
    });
  }

  function removeLine(id) {
    setTicket(prev => prev.filter(l => l.id !== id));
  }

  async function submitPayment() {
    const order = {
      id: uuidv4(),
      items: ticket,
      note,
      subtotal: Number(totals.subtotal.toFixed(2)),
      tax: Number(totals.tax.toFixed(2)),
      total: Number(totals.total.toFixed(2)),
      tendered: Number(Number(tendered || 0).toFixed(2)),
      change: Number(totals.change.toFixed(2)),
      status: 'paid',
      created_at: new Date().toISOString()
    };
    await saveOrder(order);
    // Reset ticket
    setTicket([]);
    setNote('');
    setTendered('');
    alert('Payment successful. Order recorded!');
  }

  const styles = getStyles();

  return (
    <div style={styles.grid}>
      <section style={styles.menuPanel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>Menu</div>
          <div style={styles.categoryChips}>
            <button
              style={chipStyle(!category)}
              onClick={() => setCategory('')}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                style={chipStyle(category === cat)}
                onClick={() => setCategory(cat)}
              >{cat}</button>
            ))}
          </div>
        </div>
        <div style={styles.menuGrid}>
          {filtered.map(item => (
            <button key={item.id} onClick={() => addToTicket(item)} style={styles.menuCard}>
              <div style={styles.itemName}>{item.name}</div>
              <div style={styles.itemMeta}>
                <span>{item.category || 'Other'}</span>
                <strong>{formatCurrency(item.price)}</strong>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <div style={styles.empty}>No items found.</div>}
        </div>
      </section>

      <section style={styles.ticketPanel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>Ticket</div>
        </div>
        <div style={styles.ticketLines}>
          {ticket.map(line => (
            <div key={line.id} style={styles.line}>
              <div>
                <div style={{ fontWeight: 600 }}>{line.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(17,24,39,0.7)' }}>
                  {line.qty} × {formatCurrency(line.price)}
                </div>
              </div>
              <div style={styles.lineAmount}>
                <div>{formatCurrency(line.price * line.qty)}</div>
                <button onClick={() => removeLine(line.id)} style={styles.removeBtn}>Remove</button>
              </div>
            </div>
          ))}
          {ticket.length === 0 && <div style={styles.empty}>No items in the ticket.</div>}
        </div>

        <div style={styles.noteBox}>
          <label style={styles.label}>Order Note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} style={styles.textarea} placeholder="E.g. extra hot, no foam" />
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryRow}><span>Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div>
          <div style={styles.summaryRow}><span>Tax (7%)</span><strong>{formatCurrency(totals.tax)}</strong></div>
          <div style={styles.summaryRow}><span>Total</span><strong>{formatCurrency(totals.total)}</strong></div>
        </div>

        <div style={styles.paymentBox}>
          <label style={styles.label}>Cash Tendered</label>
          <input type="number" value={tendered} onChange={(e) => setTendered(e.target.value)} placeholder="0.00" style={styles.input} />
          <div style={styles.changeRow}>
            <span>Change</span>
            <strong>{formatCurrency(totals.change)}</strong>
          </div>
          <button
            onClick={submitPayment}
            disabled={ticket.length === 0}
            style={styles.payBtn}
          >
            Collect {formatCurrency(totals.total)}
          </button>
        </div>
      </section>
    </div>
  );
}

function chipStyle(active) {
  return {
    border: `1px solid ${active ? theme.colors.secondary : theme.colors.subtleBorder}`,
    color: active ? theme.colors.text : 'rgba(17,24,39,0.8)',
    background: active ? 'rgba(245,158,11,0.16)' : 'transparent',
    padding: '6px 10px',
    borderRadius: 999,
    cursor: 'pointer',
    fontWeight: 600
  };
}

function getStyles() {
  return {
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 420px',
      gap: 20
    },
    panelHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    },
    panelTitle: { fontWeight: 700, fontSize: 18 },
    categoryChips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    menuPanel: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 16,
      boxShadow: theme.colors.shadow
    },
    menuGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 12
    },
    menuCard: {
      textAlign: 'left',
      background: 'white',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 12,
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(17,24,39,0.06)'
    },
    itemName: { fontWeight: 700, marginBottom: 6 },
    itemMeta: { display: 'flex', justifyContent: 'space-between', color: 'rgba(17,24,39,0.8)', fontSize: 13 },

    ticketPanel: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 16,
      display: 'grid',
      alignContent: 'start',
      gap: 12,
      boxShadow: theme.colors.shadow
    },
    ticketLines: { display: 'grid', gap: 8, minHeight: 120 },
    line: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px dashed ${theme.colors.subtleBorder}`,
      paddingBottom: 8
    },
    lineAmount: { display: 'grid', justifyItems: 'end', gap: 6 },
    removeBtn: {
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 6,
      padding: '4px 8px',
      background: 'transparent',
      cursor: 'pointer',
      color: theme.colors.error,
      fontWeight: 600
    },
    noteBox: { display: 'grid', gap: 6 },
    label: { fontWeight: 600, fontSize: 13 },
    textarea: {
      width: '100%',
      borderRadius: 8,
      border: `1px solid ${theme.colors.subtleBorder}`,
      padding: 8,
      resize: 'vertical'
    },
    summary: {
      display: 'grid',
      gap: 6,
      background: 'rgba(30,58,138,0.04)',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 10,
      padding: 10
    },
    summaryRow: { display: 'flex', justifyContent: 'space-between' },
    paymentBox: {
      display: 'grid',
      gap: 8,
      paddingTop: 8,
      borderTop: `1px solid ${theme.colors.subtleBorder}`
    },
    input: {
      width: '100%',
      borderRadius: 8,
      border: `1px solid ${theme.colors.subtleBorder}`,
      padding: 8
    },
    changeRow: {
      display: 'flex',
      justifyContent: 'space-between',
      background: 'rgba(245,158,11,0.08)',
      borderRadius: 8,
      padding: '8px 10px',
      border: `1px solid ${theme.colors.subtleBorder}`
    },
    payBtn: {
      background: theme.colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: 10,
      padding: '12px 14px',
      cursor: 'pointer',
      fontWeight: 700,
      boxShadow: theme.colors.shadow,
      transition: 'transform .05s ease-in-out'
    },
    empty: { color: 'rgba(17,24,39,0.7)', fontStyle: 'italic', padding: 8 }
  };
}
