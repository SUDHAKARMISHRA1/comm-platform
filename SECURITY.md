# Security notes

## Secrets

- The Expo app and the Next.js browser bundle may use the Supabase **anon** key only.
- The Supabase **service role** key exists only in `apps/web` server environment (`SUPABASE_SERVICE_ROLE_KEY`). It must never be prefixed with `NEXT_PUBLIC_` or `EXPO_PUBLIC_`.
- Do not commit `.env` or `.env.local`.

## Authorization

- Product data is enforced with **Row Level Security**. Users can read public profiles and update only their own row. They cannot insert or change `user_roles`.
- Admin UI calls `requireAdmin()` on the server. It loads the current user from the Auth cookie, then reads `user_roles`. A client-side `isAdmin` flag is not trusted.
- Non-admins are redirected to `/forbidden` before user directory queries run. Directory listing uses the service role after that check.
- Avatar uploads must land in `avatars/{userId}/...`. Storage policies reject other prefixes.

## Auth sessions

- Expo persists the Supabase session with AsyncStorage on native and the default web storage on web.
- Next.js admin uses `@supabase/ssr` cookies. Always use `getUser()` on the server, not `getSession()`, for authorization. Middleware only handles `/` → `/admin/login` and CORS for `/api/*`; it does not refresh the Auth session.

## Audit log

- `audit_logs` has RLS with no authenticated write policies. Application writes should use the service role later. The first admin UI is read-only.

## MVP compromises

- Email confirmation can be disabled in the Supabase dashboard for faster local testing. Re-enable before production.
- Admin user search interpolates the query into `.or()`. The value is still sent through the Supabase client as a filter, not raw SQL, but keep it short. A follow-up can parameterize more strictly.
- Public profile rows are readable by anyone with the anon key. Do not store private contact data on `profiles`.
