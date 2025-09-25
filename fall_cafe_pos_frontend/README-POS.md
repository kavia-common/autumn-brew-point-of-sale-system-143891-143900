# Fall Cafe POS Frontend

Classic, autumn-inspired React POS interface for cafe staff.

## Screens
- Login
- Order Taking (Header, Left Sidebar categories, Main menu grid, Right order ticket, Footer summary/payment)
- Menu Management
- Payment
- Sales Overview

## Theme
- primary: #1E3A8A
- secondary: #F59E0B
- background: #F3F4F6
- surface: #FFFFFF
- text: #111827
- error: #DC2626

## Supabase Integration
- Uses REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY from .env
- Authentication wired with signInWithPassword; when env is not set, app uses mock flows so you can still demo.

## Getting Started
- cp .env.example .env and set values (ask project orchestrator for secrets)
- npm install
- npm start

## Notes
- Database reads/writes are mocked for now. Replace mockData with real Supabase queries in future sprints.
