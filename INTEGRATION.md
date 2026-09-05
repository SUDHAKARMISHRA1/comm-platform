# Backend integration

## Architecture

```
Expo app (:8081) → Next.js API (:3000/api) → JSON file-store (data/coding/store.json)
                                           → Postgres (when service role + migrations are present)
                                           → Judge0 / local compiler / Piston for run/submit
Admin (:3000/admin) → server actions / RSC → same coding store
```

Student API calls send `Authorization: Bearer <supabase access token>`. Admin UI uses cookie sessions and `requireAdmin()` — those two auth paths are not interchangeable.

## Data storage

Persistence is **hybrid**:

1. If `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set **and** the coding tables exist, progress, votes, submissions, catalog, and feed go to Postgres.
2. Otherwise (or as a fallback) everything lives in `data/coding/store.json`, auto-seeded on first API call.

The JSON shape matches `packages/coding/src/schema.ts` and migrations `0002`–`0009`:

- `practiceSets` / skills / levels / topics — catalog
- `questions` — statements, examples, templates, test cases
- `progress` — per-user SOLVED / ATTEMPTED
- `submissions` — run history
- `feedPosts` and related like/comment rows
- CMS pages and notification campaigns (file-store; no send pipeline yet)

## Admin

1. Sign in at http://localhost:3000/admin/login
2. **Practice / Skills** — create sets, add/edit/delete/reorder questions
3. Test cases JSON: `{ id, input, expectedOutput, hidden, sequence }`
4. **Feed** — publish highlights the student app reads at `/highlights`

## Student app

Set `EXPO_PUBLIC_USE_MOCK_API=false` in `apps/app/.env` and point `EXPO_PUBLIC_API_BASE_URL` at `http://localhost:3000/api`.

```bash
pnpm dev:web   # API + admin
pnpm dev:app   # student UI
```

## Code execution

Order in `packages/coding/src/store/repository.ts` (`executeCode`):

1. **Judge0** if `JUDGE0_BASE_URL` is set
2. Else **local** `javac` / `gcc` / `g++` on the Next.js host
3. Else **Piston** if `PISTON_BASE_URL` is set
4. Else Java uses a pattern-matching mock; C/C++ return an install/config error

```bash
docker run -d -p 2358:2358 judge0/judge0-ce:latest
```

Set `JUDGE0_BASE_URL=http://localhost:2358` in `apps/web/.env.local`. Never call Judge0 from the browser.

## DB migrations

Run `supabase/migrations/0001_init.sql` through `0009_practice_catalog.sql`. Coding adapters already hybridize file-store + Supabase; they do not need a rewrite to start using Postgres after the migrations are applied.
