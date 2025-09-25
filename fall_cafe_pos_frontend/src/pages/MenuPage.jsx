import React, { useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * MenuPage
 * - Lists menu items from Supabase (id, name, price, category, is_active, image_url)
 * - Create new menu items via Supabase .insert
 * - Archive/Unarchive with .update (toggle is_active)
 * - Includes form validation, loading/error states, and user feedback
 *
 * Requirements:
 * - Env variables (must be provided by user in .env):
 *   - REACT_APP_SUPABASE_URL
 *   - REACT_APP_SUPABASE_KEY
 *
 * Future improvements:
 * - PUBLIC_INTERFACE
 *   function editMenuItem(id, patch)
 *     Add inline edit (name/price/category/image) with validation and optimistic UI.
 *
 * - PUBLIC_INTERFACE
 *   function uploadImageToStorage(file)
 *     Allow image uploads with Supabase Storage. Store public URL in menu_items.image_url.
 */
export default function MenuPage() {
  const client = useMemo(() => getSupabase(), []);
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Basic client-side validation
  function validate() {
    const errs = [];
    if (!name.trim()) errs.push('Name is required.');
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) errs.push('Price must be a positive number.');
    if (!category.trim()) errs.push('Category is required.');
    if (imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
      errs.push('Image URL must be an http(s) URL.');
    }
    if (!isSupabaseConfigured()) {
      errs.push('Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
    }
    return errs;
  }

  async function loadItems() {
    setLoadingList(true);
    setError('');
    setSuccess('');
    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Please set environment variables to load real data.');
        setItems([]);
        return;
      }

      const { data, error: fetchErr } = await client
        .from('menu_items')
        .select('id,name,price,category,is_active,image_url')
        .order('name', { ascending: true });

      if (fetchErr) throw fetchErr;
      setItems((data || []).map((d) => ({
        id: d.id,
        name: d.name,
        price: Number(d.price ?? 0),
        category: d.category || 'other',
        image_url: d.image_url || '',
        is_active: d.is_active ?? true,
      })));
    } catch (e) {
      setError(e?.message || 'Failed to load menu items.');
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // PUBLIC_INTERFACE
  async function createItem(e) {
    /** Creates a new menu item in Supabase (menu_items). */
    e?.preventDefault?.();
    setLoadingCreate(true);
    setError('');
    setSuccess('');

    const errs = validate();
    if (errs.length > 0) {
      setError(errs.join(' '));
      setLoadingCreate(false);
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        price: Number(Number(price).toFixed(2)),
        category: category.trim(),
        image_url: imageUrl.trim() || null,
        is_active: true,
      };
      const { data, error: insErr } = await client
        .from('menu_items')
        .insert(payload)
        .select('id,name,price,category,image_url,is_active')
        .single();
      if (insErr) throw insErr;

      // Update list optimistically
      setItems((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          price: Number(data.price ?? 0),
          category: data.category || 'other',
          image_url: data.image_url || '',
          is_active: data.is_active ?? true,
        },
      ]);

      setSuccess(`Created "${data.name}" successfully.`);
      // reset form
      setName('');
      setPrice('');
      setCategory('');
      setImageUrl('');
    } catch (e) {
      setError(e?.message || 'Failed to create item.');
    } finally {
      setLoadingCreate(false);
    }
  }

  // PUBLIC_INTERFACE
  async function toggleActive(item) {
    /** Toggles is_active between true/false (archive/unarchive). */
    if (!item?.id) return;
    setTogglingId(item.id);
    setError('');
    setSuccess('');
    try {
      const { data, error: updErr } = await client
        .from('menu_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id)
        .select('id,is_active,name')
        .single();
      if (updErr) throw updErr;

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_active: data.is_active } : i))
      );
      setSuccess(`${data.is_active ? 'Unarchived' : 'Archived'} "${item.name}".`);
    } catch (e) {
      setError(e?.message || 'Failed to update item.');
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
      <div className="card accent-card">
        <div className="section-title">Menu Management</div>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Create new items and manage availability with a warm autumn-styled interface.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <div className="section-title">Add New Item</div>
        {error && (
          <div
            className="card"
            role="alert"
            style={{ borderLeft: '4px solid var(--error)', color: 'var(--muted)' }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="card"
            role="status"
            style={{ borderLeft: '4px solid var(--secondary)', color: 'var(--muted)' }}
          >
            {success}
          </div>
        )}

        <form onSubmit={createItem} style={{ display: 'grid', gap: 8 }}>
          <div className="grid grid-2">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                className="input"
                placeholder="Name (e.g., Pumpkin Spice Latte)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="price" className="sr-only">Price</label>
              <input
                id="price"
                className="input"
                placeholder="Price (e.g., 4.50)"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                aria-required="true"
              />
            </div>
          </div>
          <div className="grid grid-2">
            <div>
              <label htmlFor="category" className="sr-only">Category</label>
              <input
                id="category"
                className="input"
                placeholder="Category (coffee, tea, bakery, seasonal, ...)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="image_url" className="sr-only">Image URL</label>
              <input
                id="image_url"
                className="input"
                placeholder="Image URL (optional)"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              type="submit"
              aria-label="Add new menu item"
              disabled={loadingCreate}
            >
              {loadingCreate ? 'Adding…' : 'Add Item'}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setName(''); setPrice(''); setCategory(''); setImageUrl('');
                setError(''); setSuccess('');
              }}
            >
              Reset
            </button>
          </div>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>
            Tip: Use consistent categories to help staff filter quickly. Image URL can be added later.
          </p>
        </form>
      </div>

      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="section-title" style={{ marginRight: 'auto' }}>Menu Items</div>
          <button className="btn" onClick={loadItems} disabled={loadingList}>
            {loadingList ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {loadingList && <div className="card">Loading menu items…</div>}
        {!loadingList && items.length === 0 && (
          <div className="card" role="status" style={{ color: 'var(--muted)' }}>
            No items found.
          </div>
        )}

        {!loadingList && items.length > 0 && (
          <div className="grid grid-3">
            {items.map((i) => (
              <div key={i.id} className="card" style={{ display: 'grid', gap: 8 }}>
                <div
                  aria-hidden
                  style={{
                    height: 110,
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: i.image_url
                      ? 'var(--surface)'
                      : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,74,39,0.10))',
                    overflow: 'hidden',
                  }}
                >
                  {i.image_url ? (
                    <img
                      src={i.image_url}
                      alt={`${i.name} image`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%', height: '100%',
                        background: 'radial-gradient(60% 60% at 30% 30%, rgba(255,255,255,0.35), transparent), var(--autumn-grad-strong)',
                      }}
                    />
                  )}
                </div>
                <div style={{ display: 'grid', gap: 2 }}>
                  <strong style={{ lineHeight: 1.2 }}>{i.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>${Number(i.price).toFixed(2)}</span>
                    {i.category && (
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--muted)',
                          border: '1px solid var(--border)',
                          borderRadius: 999,
                          padding: '2px 8px',
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))',
                        }}
                      >
                        {i.category}
                      </span>
                    )}
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 11,
                        color: i.is_active ? 'var(--autumn-sage)' : 'var(--muted)',
                      }}
                    >
                      {i.is_active ? 'Active' : 'Archived'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className={`btn ${i.is_active ? '' : 'btn-primary'}`}
                    aria-label={i.is_active ? `Archive ${i.name}` : `Unarchive ${i.name}`}
                    onClick={() => toggleActive(i)}
                    disabled={togglingId === i.id}
                  >
                    {togglingId === i.id ? 'Updating…' : (i.is_active ? 'Archive' : 'Unarchive')}
                  </button>
                  {/* Future: add Edit button to support inline editing */}
                  <button className="btn" disabled title="Coming soon">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>
          Future: Edit fields inline, and support secure image uploads to Supabase Storage instead of direct URLs.
        </p>
      </div>
    </div>
  );
}
