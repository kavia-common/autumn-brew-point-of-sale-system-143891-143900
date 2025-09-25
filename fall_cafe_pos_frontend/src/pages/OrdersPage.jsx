import React, { useEffect, useState } from 'react';
import MenuItemCard from '../components/MenuItemCard';
import OrderTicket from '../components/OrderTicket';
import { useOrder } from '../context/OrderContext';
import { isSupabaseConfigured, fetchMenuItems } from '../lib/supabaseClient';

// Seasonal fall-themed placeholder illustrations (URLs or data URIs).
// For now we use simple emoji-based alt descriptions and gradient background in the card when image is missing.
// Future extension: host real illustrative assets under /public/assets and reference them here.
const FALL_PLACEHOLDER = {
  src: '', // leave empty to trigger CSS gradient fallback in card
  alt: 'Seasonal fall menu item placeholder',
};

const mockMenu = [
  { id: 'latte', name: 'Latte', price: 4.50, category: 'coffee', image_url: '' },
  { id: 'americano', name: 'Americano', price: 3.00, category: 'coffee', image_url: '' },
  { id: 'pumpkin_spice', name: 'Pumpkin Spice Latte', price: 5.25, category: 'seasonal', image_url: '' },
  { id: 'chai', name: 'Chai Tea', price: 3.75, category: 'tea', image_url: '' },
  { id: 'muffin', name: 'Blueberry Muffin', price: 2.95, category: 'bakery', image_url: '' },
  { id: 'croissant', name: 'Butter Croissant', price: 3.25, category: 'bakery', image_url: '' },
];

export default function OrdersPage() {
  const { addItem } = useOrder();
  const [menu, setMenu] = useState(mockMenu);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      setLoading(true);
      setError('');
      try {
        // Only attempt Supabase fetch when env is properly configured
        if (isSupabaseConfigured()) {
          const { data, error: fetchError } = await fetchMenuItems();
          if (fetchError) {
            throw fetchError;
          }

          // Filter/transform: use only active items, map to UI shape
          const items = (data || [])
            .filter((i) => i == null ? false : (i.is_active ?? true))
            .map((i) => ({
              id: i.id,
              name: i.name,
              price: Number(i.price ?? 0),
              category: i.category || 'other',
              image_url: i.image_url || '', // Use image URL if available
            }));

          if (!cancelled && items.length > 0) {
            setMenu(items);
          } else if (!cancelled && items.length === 0) {
            // If Supabase returns empty, keep mock as a UX fallback
            setError('No menu items found. Showing sample menu.');
            setMenu(mockMenu);
          }
        } else {
          // Env not configured: keep mock data with a friendly note
          setError('Supabase is not configured. Showing sample menu.');
          setMenu(mockMenu);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Menu fetch failed. Falling back to mock data.', e);
        if (!cancelled) {
          setError('Failed to load menu. Showing sample menu.');
          setMenu(mockMenu);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: 16 }}>
      <OrderTicket />
      <section aria-label="Menu items" className="grid grid-3">
        {loading && <div className="card">Loading menu...</div>}
        {!loading && error && (
          <div className="card" role="alert" style={{ gridColumn: '1 / -1', color: 'var(--muted)' }}>
            {error}
          </div>
        )}
        {!loading && menu.map((m) => (
          <MenuItemCard
            key={m.id}
            item={{
              ...m,
              // Provide fallback info for image handling
              image_url: m.image_url || FALL_PLACEHOLDER.src,
              image_alt: m.image_url ? `${m.name} (${m.category})` : FALL_PLACEHOLDER.alt,
            }}
            onAdd={addItem}
          />
        ))}
      </section>
    </div>
  );
}
