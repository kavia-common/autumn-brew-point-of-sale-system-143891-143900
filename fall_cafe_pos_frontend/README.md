# Autumn Brew POS - Frontend (React)

A point of sale (POS) system for a fall-themed cafe. Autumn-inspired classic design with structured layout and Supabase integration.

## Features
- Orders screen to build tickets, calculate totals, and process payment
- Menu management (create/update/delete items)
- Sales dashboard (KPIs + recent orders)
- Autumn classic theme using a clean, professional palette
- Supabase integration for data persistence (menu_items, orders)
- Local fallbacks if Supabase env is not configured

## Environment
Copy `.env.example` to `.env` and set:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (optional for auth redirects)

If not set, app will function with non-persistent local data.

## Run
- npm install
- npm start
Open http://localhost:3000

## Project Structure
- src/services/supabaseClient.js: Supabase singleton
- src/services/api.js: Data access (menu, orders, sales)
- src/components/Layout.js: Header, sidebar, main, footer
- src/pages/OrdersPage.js: POS operations
- src/pages/MenuPage.js: Manage menu
- src/pages/SalesPage.js: KPIs and recent orders
- src/theme.js: Theme palette and helpers

See assets/supabase.md for schema details.
