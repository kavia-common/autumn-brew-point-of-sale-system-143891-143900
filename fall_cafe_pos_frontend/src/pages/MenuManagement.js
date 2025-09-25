import React, { useMemo, useState } from "react";
import { theme } from "../theme";
import { mockMenu } from "../services/mockData";

// PUBLIC_INTERFACE
export default function MenuManagement() {
  /**
   * Menu Management: simple CRUD mock UI
   * In future, connect to Supabase table for menu items.
   */
  const [items, setItems] = useState(mockMenu);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({ name: "", price: "", category: "" });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  const onAdd = () => {
    if (!draft.name || !draft.price || !draft.category) return;
    const newItem = {
      id: `m${Date.now()}`,
      name: draft.name,
      price: parseFloat(draft.price),
      category: draft.category,
    };
    setItems((prev) => [newItem, ...prev]);
    setDraft({ name: "", price: "", category: "" });
  };

  const onDelete = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Menu Management</div>
            <div style={styles.sub}>Create, edit and organize items</div>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category..."
            style={styles.search}
          />
        </div>

        <div style={styles.formRow}>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Item name"
            style={styles.input}
          />
          <input
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            placeholder="Price"
            type="number"
            step="0.01"
            style={styles.input}
          />
          <input
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            placeholder="Category"
            style={styles.input}
          />
          <button onClick={onAdd} style={styles.addBtn}>Add Item</button>
        </div>

        <div style={styles.list}>
          {visible.map((i) => (
            <div key={i.id} style={styles.row}>
              <div style={styles.cellName}>{i.name}</div>
              <div style={styles.cellCat}>{i.category}</div>
              <div style={styles.cellPrice}>${i.price.toFixed(2)}</div>
              <button style={styles.delBtn} onClick={() => onDelete(i.id)}>
                Delete
              </button>
            </div>
          ))}
          {visible.length === 0 && (
            <div style={styles.empty}>No items match your search.</div>
          )}
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.outline}`,
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: { fontWeight: 800 },
  sub: { color: theme.colors.subtleText, fontSize: 12, marginTop: 2 },
  search: {
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 10,
    padding: "10px 12px",
    width: 300,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr auto",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 10,
    padding: "10px 12px",
  },
  addBtn: {
    background: theme.colors.secondary,
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr auto",
    gap: 8,
    alignItems: "center",
    background: "#fff",
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 10,
    padding: "8px 10px",
  },
  cellName: { fontWeight: 700 },
  cellCat: { color: theme.colors.subtleText },
  cellPrice: { textAlign: "right", fontWeight: 700 },
  delBtn: {
    background: "transparent",
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 8,
    padding: "6px 10px",
    color: theme.colors.error,
    cursor: "pointer",
  },
  empty: {
    padding: 20,
    color: theme.colors.subtleText,
    textAlign: "center",
    fontStyle: "italic",
  },
};
