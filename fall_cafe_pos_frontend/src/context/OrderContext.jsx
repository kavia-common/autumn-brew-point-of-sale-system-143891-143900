import React, { createContext, useContext, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Order item shape:
 * { id, name, price, qty, notes }
 */

const OrderContext = createContext(undefined);

// PUBLIC_INTERFACE
export function useOrder() {
  /** Access order state and actions. */
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within an OrderProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function OrderProvider({ children }) {
  /** Provides current order state and actions for the POS. */
  const [items, setItems] = useState([]);
  const [ticketId, setTicketId] = useState(() => Math.floor(Math.random() * 100000));
  const taxRate = 0.07;

  const addItem = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));

  const clearOrder = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const tax = useMemo(() => subtotal * taxRate, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const newTicket = () => {
    clearOrder();
    setTicketId(Math.floor(Math.random() * 100000));
  };

  // PUBLIC_INTERFACE
  async function createOrder({ status = 'paid', notes = '', payment_method = null } = {}) {
    /**
     * Create a new order record in 'orders' with aggregated totals,
     * and create associated 'order_items' records for each line item.
     *
     * Attempts to run atomically if a Postgres RPC or server-side function exists.
     * Since we only have the client here, we will:
     * 1) Insert into orders
     * 2) Insert related order_items
     * If any step fails, we return an error. In a real system, consider:
     * - Using a Postgres function (RPC) to wrap these operations in a transaction
     * - Or handling compensating deletes if order_items fail after order insert
     */
    if (!isSupabaseConfigured()) {
      return { orderId: null, error: new Error('Supabase is not configured') };
    }

    const client = getSupabase();

    try {
      // Build order payload
      const orderPayload = {
        ticket_id: ticketId, // optional external reference
        status,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        notes,
        payment_method: payment_method || null,
        // created_at will be defaulted by DB if configured
      };

      // 1) Insert order
      const { data: orderData, error: orderError } = await client
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .single();

      if (orderError) {
        return { orderId: null, error: orderError };
      }
      const orderId = orderData?.id;

      // 2) Insert order items
      const itemRows = items.map((i) => ({
        order_id: orderId,
        item_id: i.id, // assumes menu item id or SKU
        name: i.name,
        unit_price: Number(i.price),
        quantity: Number(i.qty),
        line_total: Number((i.price * i.qty).toFixed(2)),
        notes: i.notes || null,
      }));

      if (itemRows.length > 0) {
        const { error: itemsError } = await client.from('order_items').insert(itemRows);
        if (itemsError) {
          // Note: Without a DB transaction, the order is already inserted at this point.
          // Consider compensating action: delete order if items fail.
          // For safety, we try to clean up to avoid orphaned orders.
          try {
            await client.from('orders').delete().eq('id', orderId);
          } catch (_) {
            // swallow cleanup errors - caller will see the original error
          }
          return { orderId: null, error: itemsError };
        }
      }

      return { orderId, error: null };
    } catch (err) {
      return { orderId: null, error: err };
    }
  }

  const value = {
    items,
    ticketId,
    taxRate,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    updateQty,
    clearOrder,
    newTicket,
    createOrder, // expose createOrder to consumers
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
