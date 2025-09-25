import React from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function MenuPage() {
  const supabase = getSupabase();

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
      <div className="card">
        <div className="section-title">Menu Management</div>
        <p style={{ margin: 0 }}>
          Create, update, or archive menu items. This screen is a placeholder for future CRUD operations.
        </p>
      </div>
      <div className="card">
        <strong>Connected to Supabase:</strong>
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>
          URL: {String(supabase?.supabaseUrl || 'n/a')}
        </div>
      </div>
      <div className="card">
        <div className="grid grid-2">
          <input className="input" placeholder="Item name" />
          <input className="input" placeholder="Price" type="number" step="0.01" />
          <input className="input" placeholder="Category" />
          <button className="btn btn-primary" aria-label="Add new menu item">Add Item</button>
        </div>
      </div>
    </div>
  );
}
