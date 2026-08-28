# Backend integration

## Architecture

```
Expo app (:8081) → Next.js API (:3000/api) → file store (data/coding/store.json)
                                           → Judge0 (:2358) for run/submit
Admin (:3000/admin/practice) → server actions → same file store
```

## Data storage (pre-DB)

Single JSON file: `data/coding/store.json` (auto-seeded on first API call).

Structure mirrors `packages/coding/src/schema.ts` and `supabase/migrations/0002_coding.sql`:
- `practiceSets` — topic/language groupings with sequence
- `questions` — statements, examples, code templates, test cases
- `progress` — per-user SOLVED/ATTEMPTED
- `submissions` — run history with test results

## Admin

1. Sign in at http://localhost:3000/admin/login
2. Open **Practice** → create sets, add/edit/delete/reorder questions
3. Test cases JSON: `{ id, input, expectedOutput, hidden, sequence }`

## Student app

Set `EXPO_PUBLIC_USE_MOCK_API=false` in `apps/app/.env`.

Run both:
```bash
pnpm dev:web   # API + admin
pnpm dev:app   # student UI
```

## Judge0 (optional)

```bash
docker run -d -p 2358:2358 judge0/judge0-ce:latest
```

Set `JUDGE0_BASE_URL=http://localhost:2358` in `apps/web/.env.local`.

Without Judge0, run/submit uses mock execution (pattern-matching).

## DB migration

When ready, run `supabase/migrations/0002_coding.sql` and replace file-store with Supabase queries in `packages/coding/src/store/repository.ts`.
