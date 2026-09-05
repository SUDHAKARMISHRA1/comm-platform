# Coding Practice Platform

Student-facing coding practice UI in the Expo product app, with Next.js API routes for catalog, feed, votes, and code execution.

## Prerequisites

- Node.js 20.19+
- pnpm 10
- Supabase project (existing auth) when not using mock API
- Optional: self-hosted [Judge0](https://github.com/judge0/judge0) or a local JDK/gcc for real code execution

## Run locally

```bash
# From repo root
pnpm install

# Product app (mock API mode — no backend required)
cp apps/app/.env.example apps/app/.env
# Set EXPO_PUBLIC_USE_MOCK_API=true

pnpm dev:app
# Press w for web → http://localhost:8081
```

### With backend API

```bash
# Terminal 1 — Next.js API + admin
cp apps/web/.env.example apps/web/.env.local
# Set EXPO_PUBLIC_USE_MOCK_API=false in apps/app/.env
pnpm dev:web   # http://localhost:3000

# Terminal 2 — Product app
pnpm dev:app
```

Sign in, then open **Highlights**, **Dashboard**, **Practice**, or **Submissions** from the header.

## Environment variables

### Product app (`apps/app/.env`)

| Variable | Description |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `EXPO_PUBLIC_API_BASE_URL` | Backend API base (default `http://localhost:3000/api`) |
| `EXPO_PUBLIC_USE_MOCK_API` | `true` = in-app mocks, `false` = call backend |

### Web API (`apps/web/.env.local`)

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (auth verification) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `JUDGE0_BASE_URL` | Judge0 API URL (optional) |
| `JUDGE0_API_KEY` | Judge0/RapidAPI key if required |
| `PISTON_BASE_URL` | Piston API (used after local compile fails) |
| `CODING_DATA_DIR` | JSON store directory (default `../../data/coding`) |

## Routes

| Route | Description |
| --- | --- |
| `/highlights` | Feed of articles/posts (default after login) |
| `/dashboard` | Stats, progress, recommendations |
| `/practice` | Question list with search/filters |
| `/practice/skills` | Skill catalog |
| `/practice/voted` | Interview-voted questions |
| `/practice/:questionId` | Problem + Monaco editor + run/submit |
| `/submissions` | Submission history |
| `/submissions/:id` | Submission detail |

Monaco runs on **web** only (loaded from jsDelivr). Native shows a fallback message.

## API contract (backend)

All endpoints require `Authorization: Bearer <supabase_access_token>`. CORS for Expo web is set in `apps/web/middleware.ts`.

- `GET /api/catalog`
- `GET /api/questions?q&difficulty&topic&status&page&pageSize`
- `GET /api/questions/:questionId`
- `POST /api/questions/:questionId/vote`
- `GET /api/questions/voted`
- `GET /api/dashboard`
- `GET /api/submissions`
- `GET /api/submissions/:submissionId`
- `POST /api/code/run` — `{ language, sourceCode, stdin }`
- `POST /api/code/submit` — `{ questionId, language, sourceCode }`
- `POST /api/code/tests` — hidden tests for a question
- `GET /api/feed`
- `POST /api/feed/:postId/like|share`
- `GET|POST /api/feed/:postId/comments`
- `POST /api/feed/comments/:commentId/like`

Frontend sends `language: "java" | "c" | "cpp"` — Judge0 IDs are mapped server-side only.

## Judge0 local setup

```bash
docker run -d -p 2358:2358 judge0/judge0-ce:latest
```

Set `JUDGE0_BASE_URL=http://localhost:2358` in `apps/web/.env.local`.

Architecture: **Browser → Expo app → Next.js API → Judge0**. Never call Judge0 from the browser.

## Tests

```bash
pnpm --filter @comm-platform/coding test
pnpm --filter @comm-platform/app test
```

## Notes

- Admin practice/skills/feed are wired to the same store the student API uses.
- Progress/submissions use Postgres when coding migrations + service role are present; otherwise `data/coding/store.json`.
- Existing header/footer/theme from `AppShell` is preserved.
