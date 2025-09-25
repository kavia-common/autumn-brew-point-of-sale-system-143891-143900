import React from 'react';
import { useOrder } from '../../context/OrderContext';

export function Footer() {
  const { subtotal, tax, total, clearOrder } = useOrder();

  return (
    <footer className="card" style={{
      borderRadius: 0,
      borderTop: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      background: 'linear-gradient(180deg, rgba(124,74,39,0.04), rgba(245,158,11,0.03)), var(--surface)',
      position: 'sticky',
      bottom: 0,
      zIndex: 10
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'grid', gap: 2, textAlign: 'right' }}>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>Subtotal</div>
            <div style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</div>
          </div>
          <div style={{ display: 'grid', gap: 2, textAlign: 'right' }}>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>Tax</div>
            <div style={{ fontWeight: 600 }}>${tax.toFixed(2)}</div>
          </div>
          <div style={{ display: 'grid', gap: 2, textAlign: 'right' }}>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>Total</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>${total.toFixed(2)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={clearOrder} aria-label="Clear current order">Clear</button>
          <button className="btn btn-primary" aria-label="Proceed to payment">Take Payment</button>
        </div>
      </div>
    </footer>
  );
}
