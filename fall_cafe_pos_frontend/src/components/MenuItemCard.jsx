import React from 'react';

export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="card" role="article" aria-label={item.name} style={{ display: 'grid', gap: 8 }}>
      <div style={{
        height: 100,
        borderRadius: 10,
        background: 'var(--autumn-grad-strong)',
        border: '1px solid var(--border)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)'
      }} aria-hidden />
      <div style={{ display: 'grid', gap: 4 }}>
        <strong>{item.name}</strong>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>${item.price.toFixed(2)}</span>
      </div>
      <button className="btn btn-primary" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to order`}>
        Add
      </button>
    </div>
  );
}
