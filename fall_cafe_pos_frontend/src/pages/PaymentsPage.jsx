import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';

export default function PaymentsPage() {
  const { total, tax, subtotal, newTicket } = useOrder();
  const [method, setMethod] = useState('card');

  const completePayment = () => {
    // Placeholder for payment integration
    alert(`Payment of $${total.toFixed(2)} via ${method} completed.`);
    newTicket();
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 380px', gap: 16 }}>
      <div className="card">
        <div className="section-title">Payment Method</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className={`btn ${method === 'card' ? 'btn-primary' : ''}`} onClick={() => setMethod('card')} aria-pressed={method==='card'}>
            Card
          </button>
          <button className={`btn ${method === 'cash' ? 'btn-primary' : ''}`} onClick={() => setMethod('cash')} aria-pressed={method==='cash'}>
            Cash
          </button>
          <button className={`btn ${method === 'gift' ? 'btn-primary' : ''}`} onClick={() => setMethod('gift')} aria-pressed={method==='gift'}>
            Gift Card
          </button>
          <button className={`btn ${method === 'other' ? 'btn-primary' : ''}`} onClick={() => setMethod('other')} aria-pressed={method==='other'}>
            Other
          </button>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div className="section-title">Details</div>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Additional inputs for the selected method will appear here during full integration.
          </p>
        </div>
      </div>
      <div className="card" style={{ alignSelf: 'start' }}>
        <div className="section-title">Summary</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tax</span><span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" onClick={completePayment} aria-label="Complete payment">
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
}
