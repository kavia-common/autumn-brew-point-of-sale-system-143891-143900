import React, { useEffect, useState } from 'react';
import MenuItemCard from '../components/MenuItemCard';
import OrderTicket from '../components/OrderTicket';
import { useOrder } from '../context/OrderContext';
import { getSupabase } from '../lib/supabaseClient';

const mockMenu = [
  { id: 'latte', name: 'Latte', price: 4.50, category: 'coffee' },
  { id: 'americano', name: 'Americano', price: 3.00, category: 'coffee' },
  { id: 'pumpkin_spice', name: 'Pumpkin Spice Latte', price: 5.25, category: 'seasonal' },
  { id: 'chai', name: 'Chai Tea', price: 3.75, category: 'tea' },
  { id: 'muffin', name: 'Blueberry Muffin', price: 2.95, category: 'bakery' },
  { id: 'croissant', name: 'Butter Croissant', price: 3.25, category: 'bakery' },
];

export default function OrdersPage() {
  const { addItem } = useOrder();
  const [menu, setMenu] = useState(mockMenu);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      try {
        const supabase = getSupabase();
        // Example: const { data, error } = await supabase.from('menu_items').select('*');
        // For now, keep mock data if no credentials or table
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Menu fetch fallback to mock data', e);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  return (
    <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: 16 }}>
      <OrderTicket />
      <section aria-label="Menu items" className="grid grid-3">
        {loading && <div className="card">Loading menu...</div>}
        {!loading && menu.map((m) => (
          <MenuItemCard key={m.id} item={m} onAdd={addItem} />
        ))}
      </section>
    </div>
  );
}
