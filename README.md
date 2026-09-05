# Comm Platform

Web-first coding practice and highlights platform: Expo product app (web now, Android/iOS later), Next.js admin portal + REST API, Supabase Auth/Postgres/RLS/Storage.

```
Expo app (:8081)
  ├─ Supabase Auth (anon key) + profile / avatar
  └─ HTTP → Next.js /api/* with Authorization: Bearer <access_token>
         │
Next.js (:3000)
  ├─ /admin  — cookie session + user_roles check
  └─ /api    — packages/coding server
         ├─ JSON file-store (data/coding/store.json) and/or Postgres
         └─ Judge0 → local compiler → Piston → Java mock
```

There is no public marketing site. `http://localhost:3000/` redirects to `/admin/login`.

## What works in this repo

| Surface | Features |
| --- | --- |
| Product app (`apps/app`) | Signup/login/logout, session restore, forgot/reset password, profile + avatar, highlights feed, practice (skills/votes), dashboard, submissions, in-app notifications. Contests, leaderboard, and settings are coming-soon placeholders. |
| Website (`apps/web`) | Admin portal + REST API for coding/feed. Root `/` redirects to admin login. |
| Admin | Server-side `user_roles` check, user directory, practice catalog, feed CMS, submissions, notifications compose (stored, not sent). Non-admins get `/forbidden`. |
| Database | `profiles`, `user_roles`, `audit_logs`, coding/votes/feed/catalog tables, avatar bucket, RLS, signup trigger |

## Packages

| Package | Role |
| --- | --- |
| `@comm-platform/types` | Shared TypeScript + Supabase `Database` typing |
| `@comm-platform/validation` | Zod schemas for auth and profile |
| `@comm-platform/api` | Supabase browser-client factory, mappers, logger |
| `@comm-platform/ui` | React Native Button/TextField + design tokens |
| `@comm-platform/coding` | Coding domain: mocks, JSON store, Supabase adapters, Judge0/Piston. Client import `.` vs server `./server`. |

More detail: `INTEGRATION.md` (backend), `apps/app/CODING.md` (student coding UI), `SECURITY.md`.

## Prerequisites

- Node.js 20.19+ and pnpm 10
- A [Supabase](https://supabase.com) project (Auth + Postgres)
- Optional: local JDK/gcc for on-host code execution, or [Judge0](https://github.com/judge0/judge0) / [Piston](https://github.com/engineer-man/piston)

## 1. Install

```bash
cd comm-platform
pnpm install
```

## 2. Create a Supabase project (manual)

1. Create a project at https://supabase.com/dashboard
2. **Authentication → Providers**: Email enabled
3. **Authentication → URL configuration**
   - Site URL: `http://localhost:8081` (Expo web)
   - Redirect URLs: `http://localhost:8081/**`, `http://localhost:3000/**`, `commplatform://**`
4. For local demo, **Authentication → Providers → Email → Confirm email** can be turned off so signup goes straight in. If you leave it on, the app shows a “check your inbox” state.
5. Copy **Project URL**, **anon public** key, and **service_role** key (service role is server-only)

## 3. Environment files

Product app — copy `apps/app/.env.example` to `apps/app/.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_USE_MOCK_API=false
```

Set `EXPO_PUBLIC_USE_MOCK_API=true` to run the student app with in-package mocks (no Next.js or Supabase required). Demo login is used only when mock API is on **and** Supabase env is missing.

Website/admin — copy `apps/web/.env.example` to `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_PRODUCT_APP_URL=http://localhost:8081
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CODING_DATA_DIR=../../data/coding
```

Optional execution (server-only): `JUDGE0_BASE_URL`, `JUDGE0_API_KEY`, `PISTON_BASE_URL`.

Never put `SUPABASE_SERVICE_ROLE_KEY` in the Expo app or any `NEXT_PUBLIC_` / `EXPO_PUBLIC_` variable.

## 4. Apply the database migrations

In the Supabase SQL editor, run every file in `supabase/migrations/` in order (`0001_init.sql` … `0009_practice_catalog.sql`).

Or with the CLI: `supabase db push` (linked project).

Confirm after `0001`:

- Tables: `profiles`, `user_roles`, `audit_logs`
- View: `admin_user_overview`
- Storage bucket: `avatars`
- RLS enabled on those tables
- Trigger `on_auth_user_created` on `auth.users`

Later migrations add coding questions, votes, submissions, the highlights feed, and the practice catalog. Until those tables exist, the API still serves (and writes) `data/coding/store.json`.

## 5. Create the first admin

Sign up once in the product app, then in SQL:

```sql
update public.user_roles
set role = 'admin'
where user_id = '<auth user uuid>';
```

Clients cannot assign `admin`. Only this SQL (or other service-role code) can.

## 6. Run the apps

```bash
pnpm dev:web    # http://localhost:3000  (admin + API)
pnpm dev:app    # Expo; press w for http://localhost:8081
```

- Product: http://localhost:8081 — sign up / sign in, then Highlights
- Admin: http://localhost:3000/admin/login

Both apps need to run together when `EXPO_PUBLIC_USE_MOCK_API=false`. Next.js middleware allows CORS from `http://localhost:8081`.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Security notes

See `SECURITY.md`. Admin authorization is checked on the server against `user_roles`. The service role key is used only in Next.js server code to list users (RLS blocks that for normal logins). Passwords and tokens are never rendered in the admin UI.
