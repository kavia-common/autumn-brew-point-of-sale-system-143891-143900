import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function PaymentsPage() {
  const { total, tax, subtotal, newTicket, createOrder } = useOrder();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // PUBLIC_INTERFACE
  async function completePayment() {
    /**
     * Handles end-to-end payment completion:
     * 1) Create order + line items via OrderContext.createOrder
     * 2) Insert payment record in 'payments' table referencing the order
     * 3) Show success or error feedback and reset the ticket on success
     *
     * Note: Full transactionality would be implemented via a Postgres function
     * that creates the order, items, and payment in a single transaction.
     */
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
      }

      // Step 1: Create the order and its items
      const { orderId, error: orderErr } = await createOrder({
        status: 'paid',
        notes: '',
        payment_method: method,
      });

      if (orderErr || !orderId) {
        throw orderErr || new Error('Failed to create order');
      }

      // Step 2: Insert a payment record referencing the order
      const client = getSupabase();
      const paymentPayload = {
        order_id: orderId,
        amount: Number(total.toFixed(2)),
        method,
        currency: 'USD',
        status: 'succeeded', // In real integration, set per processor response
      };

      const { error: paymentErr } = await client.from('payments').insert(paymentPayload);
      if (paymentErr) {
        // In a fully transactional backend, this would roll back order creation too.
        // Here we report the error to the user.
        throw paymentErr;
      }

      // Step 3: Feedback and reset
      setSuccessMsg(`Payment of $${total.toFixed(2)} via ${method} completed. Order #${orderId} created.`);
      newTicket();
    } catch (e) {
      setError(e?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 380px', gap: 16 }}>
      <div className="card">
        <div className="section-title">Payment Method</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`btn ${method === 'card' ? 'btn-primary' : ''}`}
            onClick={() => setMethod('card')}
            aria-pressed={method === 'card'}
            disabled={loading}
          >
            Card
          </button>
          <button
            className={`btn ${method === 'cash' ? 'btn-primary' : ''}`}
            onClick={() => setMethod('cash')}
            aria-pressed={method === 'cash'}
            disabled={loading}
          >
            Cash
          </button>
          <button
            className={`btn ${method === 'gift' ? 'btn-primary' : ''}`}
            onClick={() => setMethod('gift')}
            aria-pressed={method === 'gift'}
            disabled={loading}
          >
            Gift Card
          </button>
          <button
            className={`btn ${method === 'other' ? 'btn-primary' : ''}`}
            onClick={() => setMethod('other')}
            aria-pressed={method === 'other'}
            disabled={loading}
          >
            Other
          </button>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div className="section-title">Details</div>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Additional inputs for the selected method will appear here during full integration.
            {/* For example: card number entry or cash tendered, etc. */}
          </p>
        </div>
      </div>
      <div className="card" style={{ alignSelf: 'start' }}>
        <div className="section-title">Summary</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {error && (
            <div className="card" role="alert" style={{ borderLeft: '4px solid var(--error)', color: 'var(--muted)' }}>
              {error}
            </div>
          )}
          {successMsg && (
            <div
              className="card"
              role="status"
              style={{ borderLeft: '4px solid var(--secondary)', color: 'var(--muted)' }}
            >
              {successMsg}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={completePayment}
            aria-label="Complete payment"
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Complete Payment'}
          </button>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>
            Note: For full transaction safety, move order + items + payment into a single Postgres function (RPC)
            and call it from the client. This page currently performs sequential inserts and reports failures.
          </p>
        </div>
      </div>
    </div>
  );
}
