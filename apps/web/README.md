# Admin portal and API (Next.js)

Next.js app that serves:

- **Admin UI** at `/admin` (cookie session + `user_roles`)
- **REST API** at `/api/*` for the Expo product app (Bearer token)

There is no public landing page. `/` redirects to `/admin/login`.

From the repo root:

```bash
pnpm dev:web
```

The app runs at [http://localhost:3000](http://localhost:3000). Copy `apps/web/.env.example` to `apps/web/.env.local`. See the root `README.md` and `INTEGRATION.md`.
