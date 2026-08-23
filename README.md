# Comm Platform

Web-first communication platform: Expo product app (web now, Android/iOS later), Next.js public site + admin portal, Supabase Auth/Postgres/RLS/Storage.

## What works in this repo

| Surface | Features |
| --- | --- |
| Product app (`apps/app`) | Signup, login, logout, session restore, forgot/reset password, home, profile edit, avatar upload |
| Website (`apps/web`) | Public landing + `/admin` portal |
| Admin | Server-side `user_roles` check, user count, search, pagination, profile detail, 403 for non-admins |
| Database | `profiles`, `user_roles`, `audit_logs`, avatar bucket, RLS, signup trigger |

## Prerequisites

- Node.js 20.19+ and pnpm 10
- A [Supabase](https://supabase.com) project (Auth + Postgres)

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
4. For local demo, **Authentication → Providers → Email → Confirm email** can be turned off so signup goes straight to home. If you leave it on, the app shows a “check your inbox” state.
5. Copy **Project URL**, **anon public** key, and **service_role** key (service role is server-only)

## 3. Environment files

Product app — copy `apps/app/.env.example` to `apps/app/.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Website/admin — copy `apps/web/.env.example` to `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in the Expo app or any `NEXT_PUBLIC_` / `EXPO_PUBLIC_` variable.

## 4. Apply the database migration

In the Supabase SQL editor, paste and run `supabase/migrations/0001_init.sql`.

Or with the CLI: `supabase db push` (linked project).

Confirm:

- Tables: `profiles`, `user_roles`, `audit_logs`
- View: `admin_user_directory`
- Storage bucket: `avatars`
- RLS enabled on those tables
- Trigger `on_auth_user_created` on `auth.users`

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
pnpm dev:web    # http://localhost:3000
pnpm dev:app    # Expo; press w for http://localhost:8081
```

- Product: http://localhost:8081 — Sign up / Sign in
- Admin: http://localhost:3000/admin/login

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Security notes

See `SECURITY.md`. Admin authorization is checked on the server against `user_roles`. The service role key is used only in Next.js server code to list users (RLS blocks that for normal logins). Passwords and tokens are never rendered in the admin UI.
