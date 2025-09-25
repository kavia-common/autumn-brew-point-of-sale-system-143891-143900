# Supabase Integration - Autumn Brew POS Frontend

This app uses Supabase for authentication and data storage.

Environment variables (set in fall_cafe_pos_frontend/.env):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (optional, used for email redirect flows if enabling auth)

Example `.env`:
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsIn...
REACT_APP_SITE_URL=http://localhost:3000

Database objects provisioned (public schema):
1) menu_items
- id: uuid primary key default gen_random_uuid()
- name: text not null
- price: numeric not null default 0
- category: text
- created_at: timestamptz not null default now()

2) orders
- id: uuid primary key default gen_random_uuid()
- items: jsonb not null default '[]'::jsonb  (array of line items: [{ id, name, price, qty }])
- subtotal: numeric not null default 0
- tax: numeric not null default 0
- total: numeric not null default 0
- tendered: numeric
- change: numeric
- note: text
- status: text default 'paid'
- created_at: timestamptz not null default now()

Row Level Security (RLS) policies installed:
- menu_items:
  - Allow anon SELECT
  - Allow anon INSERT/UPDATE/DELETE (permissive, suitable for demo/dev; tighten for production)
- orders:
  - Allow anon SELECT
  - Allow anon INSERT
- Both tables have RLS enabled.

Indexing:
- orders: index on created_at (DESC) for faster recent order queries.

Adjusting security for production
- Replace anon-wide policies with authenticated role policies.
- Consider using authenticated and service roles, separating write access for menu management behind admin auth.
- If enabling auth flows, update Authentication > URL Configuration:
  - Site URL: your production domain
  - Redirect URLs:
    * http://localhost:3000/**
    * https://yourapp.com/**
- Update email templates as desired.

Frontend integration notes
- The app reads env vars via src/services/supabaseClient.js
- If REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_KEY is missing, the app falls back to local data and logs a warning.
- All data calls are in src/services/api.js and target menu_items and orders.

Optional auth helpers
- getAuth() is exported from src/services/supabaseClient.js.
- When enabling auth flows, ensure your redirect handlers point to `${SITE_URL}/auth/callback` and update Supabase allow list accordingly.

Troubleshooting
- 401/permission errors: Verify RLS policies and that you are using anon/public key in the frontend.
- Table not found: Ensure migrations ran or re-create tables following the structure above.
- Missing env: Ensure both REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are present in .env.
