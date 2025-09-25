import React, { useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * MenuPage
 * - Lists menu items from Supabase (id, name, price, category, is_active, image_url)
 * - Create new menu items via Supabase .insert
 * - Archive/Unarchive with .update (toggle is_active)
 * - Edit existing items (inline or via modal) with Supabase .update
 * - Includes form validation, loading/error states, and user feedback
 * - NEW: Supports image uploads to Supabase Storage ('menu-images' bucket) for both add and edit flows.
 *        Falls back to manual image_url when no file is selected.
 *
 * Requirements:
 * - Env variables (must be provided by user in .env):
 *   - REACT_APP_SUPABASE_URL
 *   - REACT_APP_SUPABASE_KEY
 */
export default function MenuPage() {
  const client = useMemo(() => getSupabase(), []);
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state (create)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null); // id of item being edited inline
  const [editDraft, setEditDraft] = useState({ name: '', price: '', category: '', image_url: '' });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editErr, setEditErr] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Modal state (optional alternative to inline)
  const [modalOpen, setModalOpen] = useState(false);

  // Utility: ensure 'menu-images' bucket exists and is public
  async function ensureBucket() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
    }
    // Attempt to create the bucket; if it exists, Supabase returns an error we can ignore.
    const bucketName = 'menu-images';
    try {
      const { error: createErr } = await client.storage.createBucket(bucketName, {
        public: true,
      });
      if (createErr && !String(createErr.message || '').toLowerCase().includes('already exists')) {
        // If another error (not already exists), throw.
        throw createErr;
      }
    } catch (e) {
      // Re-throw to caller to surface error.
      throw e;
    }
    return bucketName;
  }

  // Utility: upload a file and return public URL
  async function uploadImageAndGetPublicUrl(file, itemIdHint = 'new') {
    if (!file) return null;
    const bucketName = await ensureBucket();

    // Simple type guard and extension
    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
    const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext) ? ext : 'jpg';
    const path = `${itemIdHint}/${Date.now()}_${Math.random().toString(36).slice(2)}.${safeExt}`;

    const { error: uploadErr } = await client.storage.from(bucketName).upload(path, file, {
      upsert: false,
      cacheControl: '3600',
      contentType: file.type || undefined,
    });
    if (uploadErr) throw uploadErr;

    const { data: publicData } = client.storage.from(bucketName).getPublicUrl(path);
    return publicData?.publicUrl || null;
  }

  // Basic client-side validation for create
  function validateCreate() {
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

  // Validation for edit fields
  function validateEdit(draft) {
    const errs = [];
    if (!draft.name?.trim()) errs.push('Name is required.');
    const p = Number(draft.price);
    if (!Number.isFinite(p) || p <= 0) errs.push('Price must be a positive number.');
    if (!draft.category?.trim()) errs.push('Category is required.');
    if (draft.image_url && !/^https?:\/\/.+/i.test(draft.image_url)) {
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
    /** Creates a new menu item in Supabase (menu_items). Supports optional image file upload. */
    e?.preventDefault?.();
    setLoadingCreate(true);
    setError('');
    setSuccess('');

    const errs = validateCreate();
    if (errs.length > 0) {
      setError(errs.join(' '));
      setLoadingCreate(false);
      return;
    }

    try {
      let finalImageUrl = imageUrl.trim() || null;

      // If a file is provided, upload and use its public URL
      if (imageFile) {
        try {
          const uploadedUrl = await uploadImageAndGetPublicUrl(imageFile, 'new-item');
          if (uploadedUrl) finalImageUrl = uploadedUrl;
        } catch (uploadErr) {
          // Non-fatal: fallback to any typed URL if present, else no image.
          setError(`Image upload failed: ${uploadErr?.message || 'Unknown error'}. Proceeding without uploaded image.`);
        }
      }

      const payload = {
        name: name.trim(),
        price: Number(Number(price).toFixed(2)),
        category: category.trim(),
        image_url: finalImageUrl,
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
      setImageFile(null);
      setImagePreview('');
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

  function startInlineEdit(item) {
    setEditingId(item.id);
    setEditDraft({
      name: item.name,
      price: String(item.price),
      category: item.category || '',
      image_url: item.image_url || '',
    });
    setEditImageFile(null);
    setEditImagePreview('');
    setEditErr('');
    setEditSuccess('');
  }

  function cancelInlineEdit() {
    setEditingId(null);
    setEditDraft({ name: '', price: '', category: '', image_url: '' });
    setEditImageFile(null);
    setEditImagePreview('');
    setEditErr('');
    setEditSuccess('');
  }

  // PUBLIC_INTERFACE
  async function saveInlineEdit(id) {
    /** Validate and persist edited fields for a single item via Supabase .update. If a new file is selected, upload then update image_url. */
    if (!id) return;
    const errs = validateEdit(editDraft);
    if (errs.length > 0) {
      setEditErr(errs.join(' '));
      setEditSuccess('');
      return;
    }

    setSavingEdit(true);
    setEditErr('');
    setEditSuccess('');
    try {
      let finalImageUrl = editDraft.image_url?.trim() || null;

      // If a new file is provided in edit flow, upload and override
      if (editImageFile) {
        try {
          const uploadedUrl = await uploadImageAndGetPublicUrl(editImageFile, `item-${id}`);
          if (uploadedUrl) finalImageUrl = uploadedUrl;
        } catch (uploadErr) {
          setEditErr(`Image upload failed: ${uploadErr?.message || 'Unknown error'}. Keeping existing image URL.`);
        }
      }

      const patch = {
        name: editDraft.name.trim(),
        price: Number(Number(editDraft.price).toFixed(2)),
        category: editDraft.category.trim(),
        image_url: finalImageUrl,
      };

      const { data, error: updErr } = await client
        .from('menu_items')
        .update(patch)
        .eq('id', id)
        .select('id,name,price,category,image_url,is_active')
        .single();

      if (updErr) throw updErr;

      // Update local list with returned row to reflect immediate changes and update image preview
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                name: data.name,
                price: Number(data.price ?? 0),
                category: data.category || 'other',
                image_url: data.image_url || '',
                is_active: data.is_active ?? i.is_active,
              }
            : i
        )
      );

      setEditSuccess(`Saved changes to "${data.name}".`);
      setSuccess(`Saved changes to "${data.name}".`);
      setEditingId(null);
      setEditDraft({ name: '', price: '', category: '', image_url: '' });
      setEditImageFile(null);
      setEditImagePreview('');

      // Refresh list to ensure consistency (e.g., triggers, computed fields)
      await loadItems();
    } catch (e) {
      setEditErr(e?.message || 'Failed to save changes.');
    } finally {
      setSavingEdit(false);
    }
  }

  // Optional modal save path (re-uses same validation & update)
  async function saveModalEdit() {
    if (!editingId) return;
    await saveInlineEdit(editingId);
    setModalOpen(false);
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
      <div className="card accent-card">
        <div className="section-title">Menu Management</div>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Create, edit, and manage availability with a warm autumn-styled interface.
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

          {/* Image file selector with live preview */}
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <label htmlFor="image_file" className="sr-only">Upload Image</label>
              <input
                id="image_file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImagePreview(url);
                  } else {
                    setImagePreview('');
                  }
                }}
                aria-label="Select image file to upload (optional)"
                className="input"
              />
            </div>
            <div aria-hidden style={{ height: 110, borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: imagePreview || imageUrl ? 'var(--surface)' : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,74,39,0.10))' }}>
              {(imagePreview || imageUrl) ? (
                <img
                  src={imagePreview || imageUrl}
                  alt="Preview of new menu item"
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
                setImageFile(null); setImagePreview('');
                setError(''); setSuccess('');
              }}
            >
              Reset
            </button>
          </div>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>
            Tip: You can either paste an Image URL or upload a file (stored in Supabase Storage).
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
            {items.map((i) => {
              const isEditing = editingId === i.id;
              const previewSrc = isEditing ? (editImagePreview || editDraft.image_url) : i.image_url;
              return (
                <div key={i.id} className="card" style={{ display: 'grid', gap: 8 }}>
                  <div
                    aria-hidden
                    style={{
                      height: 110,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: previewSrc
                        ? 'var(--surface)'
                        : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,74,39,0.10))',
                      overflow: 'hidden',
                    }}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt={`${i.name} image`}
                        loading="eager"
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

                  {!isEditing && (
                    <>
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
                        <button
                          className="btn"
                          onClick={() => {
                            startInlineEdit(i);
                            setModalOpen(false);
                          }}
                          aria-label={`Edit ${i.name}`}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            startInlineEdit(i);
                            setModalOpen(true);
                          }}
                          aria-label={`Edit ${i.name} in modal`}
                          title="Edit in modal"
                        >
                          Modal
                        </button>
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <form
                      onSubmit={(e) => { e.preventDefault(); saveInlineEdit(i.id); }}
                      style={{ display: 'grid', gap: 8 }}
                      aria-label={`Editing ${i.name}`}
                    >
                      {editErr && (
                        <div className="card" role="alert" style={{ borderLeft: '4px solid var(--error)', color: 'var(--muted)' }}>
                          {editErr}
                        </div>
                      )}
                      {editSuccess && (
                        <div className="card" role="status" style={{ borderLeft: '4px solid var(--secondary)', color: 'var(--muted)' }}>
                          {editSuccess}
                        </div>
                      )}
                      <div className="grid grid-2">
                        <div>
                          <label htmlFor={`edit-name-${i.id}`} className="sr-only">Name</label>
                          <input
                            id={`edit-name-${i.id}`}
                            className="input"
                            value={editDraft.name}
                            onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                            placeholder="Name"
                            required
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor={`edit-price-${i.id}`} className="sr-only">Price</label>
                          <input
                            id={`edit-price-${i.id}`}
                            className="input"
                            type="number"
                            step="0.01"
                            min="0"
                            value={editDraft.price}
                            onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                            placeholder="Price"
                            required
                            aria-required="true"
                          />
                        </div>
                      </div>
                      <div className="grid grid-2">
                        <div>
                          <label htmlFor={`edit-category-${i.id}`} className="sr-only">Category</label>
                          <input
                            id={`edit-category-${i.id}`}
                            className="input"
                            value={editDraft.category}
                            onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                            placeholder="Category"
                            required
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor={`edit-image-${i.id}`} className="sr-only">Image URL</label>
                          <input
                            id={`edit-image-${i.id}`}
                            className="input"
                            type="url"
                            value={editDraft.image_url}
                            onChange={(e) => setEditDraft((d) => ({ ...d, image_url: e.target.value }))}
                            placeholder="Image URL (optional)"
                          />
                        </div>
                      </div>

                      {/* File input + live preview for edit */}
                      <div className="grid grid-2" style={{ alignItems: 'center' }}>
                        <div>
                          <label htmlFor={`edit-image-file-${i.id}`} className="sr-only">Upload new image</label>
                          <input
                            id={`edit-image-file-${i.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setEditImageFile(file);
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setEditImagePreview(url);
                              } else {
                                setEditImagePreview('');
                              }
                            }}
                            aria-label="Select image file to upload for this item (optional)"
                            className="input"
                          />
                        </div>
                        <div aria-hidden style={{ height: 110, borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: (editImagePreview || editDraft.image_url) ? 'var(--surface)' : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,74,39,0.10))' }}>
                          {(editImagePreview || editDraft.image_url) ? (
                            <img
                              src={editImagePreview || editDraft.image_url}
                              alt="Preview of edited menu item"
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
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          aria-label={`Save changes to ${i.name}`}
                          disabled={savingEdit}
                        >
                          {savingEdit ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={cancelInlineEdit}
                          aria-label="Cancel editing"
                          disabled={savingEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Accessible Modal for editing (optional) */}
        {modalOpen && editingId && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="editModalTitle"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.35)',
              display: 'grid',
              placeItems: 'center',
              padding: 16,
              zIndex: 50,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !savingEdit) {
                setModalOpen(false);
                cancelInlineEdit();
              }
            }}
          >
            <div className="card" style={{ width: 'min(560px, 96vw)', display: 'grid', gap: 12 }}>
              <div id="editModalTitle" className="section-title">Edit Menu Item</div>
              {editErr && (
                <div className="card" role="alert" style={{ borderLeft: '4px solid var(--error)', color: 'var(--muted)' }}>
                  {editErr}
                </div>
              )}
              <div className="grid grid-2">
                <div>
                  <label htmlFor="modal-edit-name" className="sr-only">Name</label>
                  <input
                    id="modal-edit-name"
                    className="input"
                    value={editDraft.name}
                    onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Name"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="modal-edit-price" className="sr-only">Price</label>
                  <input
                    id="modal-edit-price"
                    className="input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editDraft.price}
                    onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                    placeholder="Price"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="grid grid-2">
                <div>
                  <label htmlFor="modal-edit-category" className="sr-only">Category</label>
                  <input
                    id="modal-edit-category"
                    className="input"
                    value={editDraft.category}
                    onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                    placeholder="Category"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="modal-edit-image" className="sr-only">Image URL</label>
                  <input
                    id="modal-edit-image"
                    className="input"
                    type="url"
                    value={editDraft.image_url}
                    onChange={(e) => setEditDraft((d) => ({ ...d, image_url: e.target.value }))}
                    placeholder="Image URL (optional)"
                  />
                </div>
              </div>
              {/* Live preview in modal */}
              <div
                aria-hidden
                style={{
                  height: 140,
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  background: (editImagePreview || editDraft.image_url)
                    ? 'var(--surface)'
                    : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,74,39,0.10))',
                }}
              >
                {(editImagePreview || editDraft.image_url) ? (
                  <img
                    src={editImagePreview || editDraft.image_url}
                    alt="Preview of menu item"
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

              {/* Modal: file input for image upload */}
              <div>
                <label htmlFor="modal-edit-image-file" className="sr-only">Upload image</label>
                <input
                  id="modal-edit-image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setEditImageFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setEditImagePreview(url);
                    } else {
                      setEditImagePreview('');
                    }
                  }}
                  aria-label="Select image file to upload for this item (optional)"
                  className="input"
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  className="btn"
                  onClick={() => { if (!savingEdit) { setModalOpen(false); cancelInlineEdit(); } }}
                  aria-label="Cancel"
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveModalEdit}
                  aria-label="Save changes"
                  disabled={savingEdit}
                >
                  {savingEdit ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>
          You can edit items inline or via modal. Paste an Image URL or upload a file to store it in Supabase Storage. Previews update immediately.
        </p>
      </div>
    </div>
  );
}
