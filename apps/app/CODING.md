# Coding Practice Platform

Student-facing coding practice UI integrated into the Expo product app, with Next.js API routes for code execution (Judge0 adapter).

## Prerequisites

- Node.js 20.19+
- pnpm 10
- Supabase project (existing auth)
- Optional: self-hosted [Judge0](https://github.com/judge0/judge0) for real code execution

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
# Terminal 1 — Next.js API routes
cp apps/web/.env.example apps/web/.env.local
# Set EXPO_PUBLIC_USE_MOCK_API=false in apps/app/.env
pnpm dev:web   # http://localhost:3000

# Terminal 2 — Product app
pnpm dev:app
```

Sign in, then open **Dashboard**, **Practice**, or **Submissions** from the header.

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
| `JUDGE0_BASE_URL` | Judge0 API URL (optional; mock if unset) |
| `JUDGE0_API_KEY` | Judge0/RapidAPI key if required |

## Routes

| Route | Description |
| --- | --- |
| `/dashboard` | Stats, progress, recommendations |
| `/practice` | Question list with search/filters |
| `/practice/:questionId` | Problem + Monaco editor + run/submit |
| `/submissions` | Submission history |
| `/submissions/:id` | Submission detail |

## API contract (backend)

All endpoints require `Authorization: Bearer <supabase_access_token>`.

- `GET /api/questions?q&difficulty&topic&status&page&pageSize`
- `GET /api/questions/:questionId`
- `GET /api/dashboard`
- `GET /api/submissions`
- `GET /api/submissions/:submissionId`
- `POST /api/code/run` — `{ language, sourceCode, stdin }`
- `POST /api/code/submit` — `{ questionId, language, sourceCode }`

Frontend sends `language: "java" | "c" | "cpp"` — Judge0 IDs are mapped server-side only.

## Judge0 local setup

```bash
# Example with Docker (see Judge0 docs)
docker run -d -p 2358:2358 judge0/judge0-ce:latest
```

Set `JUDGE0_BASE_URL=http://localhost:2358` in `apps/web/.env.local`.

Architecture: **Browser → Expo app → Next.js API → Judge0**. Never call Judge0 from the browser.

## Tests

```bash
pnpm --filter @comm-platform/coding test
pnpm --filter @comm-platform/app test
```

## Assumptions

- Mock question data until admin question management is wired to the API.
- User progress/submissions are mock-backed; replace with Postgres when backend is ready.
- Monaco editor runs on **web** only; native shows a fallback message.
- Existing header/footer/theme from `AppShell` is preserved.
