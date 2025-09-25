# Supabase Integration - Autumn Brew POS Frontend

This app uses Supabase for authentication and data storage. Configure the following environment variables in `.env` at the project root of the `fall_cafe_pos_frontend` container:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (used for email redirect flows if enabling auth UI)

Example `.env`:
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsIn...
REACT_APP_SITE_URL=http://localhost:3000

Tables expected (you can create with SQL or Supabase Table editor):

1) menu_items
- id: uuid (primary key) or text
- name: text
- price: numeric
- category: text
- created_at: timestamp (default now())

2) orders
- id: uuid (primary key)
- items: jsonb (array of line items: [{ id, name, price, qty }])
- subtotal: numeric
- tax: numeric
- total: numeric
- tendered: numeric
- change: numeric
- note: text
- status: text
- created_at: timestamp (default now())

If you do not provide env variables, the app will continue to work with local fallback data (no persistence). Once env vars are set and tables are created, the app will automatically store and retrieve data from Supabase.

Auth
Currently, the POS operates without an explicit sign-in flow for simplicity. You can add auth as needed using `getAuth()` exported by `src/services/supabaseClient.js`.

Security
When deploying, ensure Row Level Security (RLS) policies are configured appropriately for your use case.
