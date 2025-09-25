import React from 'react';
import { useOrder } from '../context/OrderContext';

export default function OrderTicket() {
  const { items, ticketId, updateQty, removeItem, subtotal } = useOrder();

  return (
    <div className="card" aria-label="Order ticket" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="section-title">Ticket</div>
          <div style={{ fontWeight: 700 }}>#{ticketId}</div>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>{items.length} items</div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 8 }}>
        {items.length === 0 && (
          <div style={{ color: 'var(--muted)' }}>No items yet. Add from the menu.</div>
        )}
        {items.map((i) => (
          <div key={i.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{i.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>${i.price.toFixed(2)} each</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor={`qty-${i.id}`} className="sr-only">Quantity</label>
              <input
                id={`qty-${i.id}`}
                className="input"
                type="number"
                min={1}
                value={i.qty}
                onChange={(e) => updateQty(i.id, Number(e.target.value))}
                style={{ width: 72 }}
                aria-label={`Quantity for ${i.name}`}
              />
              <button className="btn" onClick={() => removeItem(i.id)} aria-label={`Remove ${i.name}`}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
