import React from 'react';
import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="card" style={{
      borderRadius: 0,
      border: 0,
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      background: 'linear-gradient(180deg, rgba(245,158,11,0.05), rgba(124,74,39,0.03)), var(--surface)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, maxWidth: 1280, margin: '0 auto' }}>
        <div aria-label="Brand" style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'var(--autumn-grad-strong)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(217,119,6,0.16)'
        }} />
        <div style={{ display: 'grid' }}>
          <strong style={{ fontSize: 16, letterSpacing: '0.02em' }}>Fall Cafe POS</strong>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Autumn-inspired, classic interface</span>
        </div>
        <nav aria-label="Primary" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <NavLink className="btn btn-ghost" to="/orders">Orders</NavLink>
          <NavLink className="btn btn-ghost" to="/menu">Menu</NavLink>
          <NavLink className="btn btn-ghost" to="/payments">Payments</NavLink>
        </nav>
      </div>
    </header>
  );
}
