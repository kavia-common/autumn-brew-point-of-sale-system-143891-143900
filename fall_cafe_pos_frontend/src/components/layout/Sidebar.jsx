import React from 'react';

const categories = [
  { id: 'coffee', name: 'Coffee' },
  { id: 'tea', name: 'Tea' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'seasonal', name: 'Seasonal' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'other', name: 'Other' },
];

export function Sidebar() {
  return (
    <aside aria-label="Order categories" style={{
      background: 'linear-gradient(180deg, rgba(245,158,11,0.04), rgba(124,74,39,0.02)), var(--surface)',
      borderRight: '1px solid var(--border)',
      padding: 12,
      minHeight: 0
    }}>
      <div className="section-title">Categories</div>
      <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
        {categories.map(c => (
          <button key={c.id} className="btn" style={{ justifyContent: 'space-between' }} aria-label={`Filter ${c.name}`}>
            <span>{c.name}</span>
            <span aria-hidden>›</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
