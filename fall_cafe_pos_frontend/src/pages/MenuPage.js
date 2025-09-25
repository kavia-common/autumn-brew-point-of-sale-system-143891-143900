import { useEffect, useState } from 'react';
import { deleteMenuItem, fetchMenu, upsertMenuItem } from '../services/api';
import { formatCurrency, theme } from '../theme';

/**
 * PUBLIC_INTERFACE
 * MenuPage
 * Allows staff to manage menu items.
 */
export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const items = await fetchMenu();
    setMenu(items);
  }
  useEffect(() => { load(); }, []);

  function startCreate() {
    setEditing({ id: undefined, name: '', price: 0, category: '' });
  }

  function startEdit(item) {
    setEditing({ ...item });
  }

  async function save() {
    const cleaned = {
      ...editing,
      price: Number(editing.price || 0)
    };
    await upsertMenuItem(cleaned);
    setEditing(null);
    await load();
  }

  async function remove(id) {
    if (!window.confirm('Delete this menu item?')) return;
    await deleteMenuItem(id);
    await load();
  }

  const styles = getStyles();

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.title}>Menu Management</div>
        <button onClick={startCreate} style={styles.createBtn}>+ New Item</button>
      </div>

      <div style={styles.grid}>
        {menu.map(m => (
          <div key={m.id} style={styles.card}>
            <div style={{ fontWeight: 700 }}>{m.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(17,24,39,0.8)' }}>{m.category || 'Other'}</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{formatCurrency(m.price)}</div>
            <div style={styles.actions}>
              <button onClick={() => startEdit(m)} style={styles.outlineBtn}>Edit</button>
              <button onClick={() => remove(m.id)} style={styles.dangerBtn}>Delete</button>
            </div>
          </div>
        ))}
        {menu.length === 0 && <div style={styles.empty}>No menu items yet.</div>}
      </div>

      {editing && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>{editing.id ? 'Edit Menu Item' : 'Create Menu Item'}</div>
              <button onClick={() => setEditing(null)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.form}>
              <label style={styles.label}>Name</label>
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={styles.input} />

              <label style={styles.label}>Category</label>
              <input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} style={styles.input} />

              <label style={styles.label}>Price</label>
              <input type="number" step=".01" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} style={styles.input} />

              <div style={styles.modalActions}>
                <button onClick={() => setEditing(null)} style={styles.outlineBtn}>Cancel</button>
                <button onClick={save} style={styles.primaryBtn}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function getStyles() {
  return {
    wrap: {
      background: 'white',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 16,
      boxShadow: theme.colors.shadow
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontWeight: 800, fontSize: 18 },
    createBtn: {
      background: theme.colors.secondary,
      color: '#111827',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 8,
      padding: '8px 12px',
      fontWeight: 700,
      cursor: 'pointer'
    },
    grid: {
      marginTop: 12,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 12
    },
    card: {
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 12,
      background: 'white',
      boxShadow: '0 2px 8px rgba(17,24,39,0.06)'
    },
    actions: { display: 'flex', gap: 8, marginTop: 10 },
    outlineBtn: {
      background: 'transparent',
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 8,
      padding: '6px 10px',
      cursor: 'pointer',
      fontWeight: 700
    },
    dangerBtn: {
      background: 'transparent',
      border: `1px solid ${theme.colors.error}`,
      color: theme.colors.error,
      borderRadius: 8,
      padding: '6px 10px',
      cursor: 'pointer',
      fontWeight: 700
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.25)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 100
    },
    modalCard: {
      width: 'min(520px, 92vw)',
      background: 'white',
      borderRadius: 12,
      border: `1px solid ${theme.colors.subtleBorder}`,
      boxShadow: theme.colors.shadow
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      borderBottom: `1px solid ${theme.colors.subtleBorder}`
    },
    modalTitle: { fontWeight: 800 },
    closeBtn: {
      border: 'none',
      background: 'transparent',
      fontSize: 18,
      cursor: 'pointer'
    },
    form: { display: 'grid', gap: 8, padding: 12 },
    label: { fontWeight: 700, fontSize: 13 },
    input: {
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 8,
      padding: 8
    },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
    primaryBtn: {
      background: theme.colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: 8,
      padding: '8px 12px',
      cursor: 'pointer',
      fontWeight: 800
    },
    empty: { color: 'rgba(17,24,39,0.7)', fontStyle: 'italic' }
  };
}
