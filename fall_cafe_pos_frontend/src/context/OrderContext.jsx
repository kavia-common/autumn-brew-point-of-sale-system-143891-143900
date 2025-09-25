import React, { createContext, useContext, useMemo, useState } from 'react';

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

  const updateQty = (id, qty) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));

  const clearOrder = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const tax = useMemo(() => subtotal * taxRate, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const newTicket = () => {
    clearOrder();
    setTicketId(Math.floor(Math.random() * 100000));
  };

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
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
