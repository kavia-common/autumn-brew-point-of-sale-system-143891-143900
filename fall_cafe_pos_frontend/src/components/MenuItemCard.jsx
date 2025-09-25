import React from 'react';

/**
 * Renders a menu item card with a responsive image (if provided) and details.
 * - Uses item.image_url when available. Falls back to a seasonal gradient panel otherwise.
 * - Includes accessible alt text via item.image_alt or a default description.
 * - Layout preserves existing fall styling and grid appearance.
 *
 * Future extension:
 * - Replace image_url strings with Supabase Storage public URLs.
 * - Add upload workflows in MenuPage to store images and save their paths in menu_items.image_url.
 */
export default function MenuItemCard({ item, onAdd }) {
  const hasImage = Boolean(item?.image_url);

  return (
    <div className="card" role="article" aria-label={item.name} style={{ display: 'grid', gap: 8 }}>
      <div
        style={{
          width: '100%',
          height: 140,
          borderRadius: 10,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
          background: hasImage
            ? 'var(--surface)'
            : 'linear-gradient(135deg, rgba(245,158,11,0.20), rgba(124,74,39,0.12))',
        }}
      >
        {hasImage ? (
          <img
            src={item.image_url}
            alt={item.image_alt || `${item.name} - ${item.category || 'menu item'}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          // Decorative fallback block (seasonal); marked aria-hidden to avoid redundancy with text below.
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(60% 60% at 20% 20%, rgba(255,255,255,0.35), transparent), var(--autumn-grad-strong)',
            }}
          />
        )}
      </div>

      <div style={{ display: 'grid', gap: 2 }}>
        <strong style={{ lineHeight: 1.2 }}>{item.name}</strong>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>${item.price.toFixed(2)}</span>
          {item.category && (
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
              {item.category}
            </span>
          )}
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => onAdd(item)}
        aria-label={`Add ${item.name} to order`}
      >
        Add
      </button>
    </div>
  );
}
