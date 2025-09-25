# Fall Cafe POS Frontend

A classic, autumn-inspired React POS interface for cafe staff. Provides order processing, menu management, and payment handling with a clean, structured layout and subtle shadows.

## Highlights

- Classic layout: Header, left Sidebar, Main content, and Footer summary
- Autumn theme palette via CSS variables
- Accessible and responsive with semantic markup
- Supabase integration scaffolded via environment variables
- Maintainable structure: components, pages, context, and lib

## Getting Started

1. Install dependencies
   - npm install

2. Configure environment
   - Copy `.env.example` to `.env` and set:
     - REACT_APP_SUPABASE_URL
     - REACT_APP_SUPABASE_KEY

3. Run the app
   - npm start
   - Open http://localhost:3000

4. Tests
   - npm test

## Project Structure

- src/theme.css: Theme variables (colors, shadows, borders)
- src/App.css: Layout and component styles (classic, subtle shadows)
- src/context/OrderContext.jsx: Order state, totals, and actions
- src/lib/supabaseClient.js: Supabase client (uses env vars)
- src/components/layout: Header, Sidebar, Footer
- src/components: MenuItemCard, OrderTicket
- src/pages: OrdersPage, MenuPage, PaymentsPage
- src/App.js: Routes and app shell

## Supabase

Environment variables:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

The app works with mock data when these are not provided. On integration, wire the pages to your Supabase tables (e.g., menu_items, orders, payments).

## Theme

Primary: #1E3A8A
Secondary: #F59E0B
Background: #F3F4F6
Surface: #FFFFFF
Text: #111827

These are applied via CSS variables and can be adjusted in `src/theme.css`.

## Notes

- This is a scaffold for quick iteration. Replace mock data with real Supabase queries as backend is ready.
- Avoid hardcoding credentials; always use environment variables.
