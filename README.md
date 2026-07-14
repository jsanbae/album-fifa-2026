# Album FIFA 2026

Digital companion for collecting the FIFA World Cup 2026 sticker album. Track what you have, what is missing, and where your duplicates sit — without spreadsheets or pen-and-paper lists.

## Stack

- **Runtime / package manager:** [Bun](https://bun.sh)
- **Language:** TypeScript
- **Frontend:** React (Vite SPA)
- **Backend:** Bun / Express API
- **Auth & data:** Supabase

Monorepo workspaces: `common`, `backend`, `frontend`.

## Prerequisites

- [Bun](https://bun.sh) (see `packageManager` in `package.json`)
- A [Supabase](https://supabase.com) project (URL, publishable key, and secret key)

## Local setup

1. Clone the repository and open the root directory.
2. Copy the example env file and fill in your Supabase values:

   ```bash
   cp .env.example .env
   ```

   For local development, keep `VITE_API_URL=http://localhost:3005` and `CORS_ORIGIN=http://localhost:5173`. See `.env.example` for variable descriptions and Supabase Auth redirect URLs (`http://localhost:5173`).

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the API and SPA together:

   ```bash
   bun run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3005`

Optional: set `DEV_USER_ID` in `.env` to use the app without signing in locally. Do not set this in production.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Run backend and frontend in development |
| `bun run test` | Run tests in all workspaces |
| `bun run lint` | Lint all workspaces |
| `bun run build` | Build common, backend, and frontend |
| `bun run build:backend` | Build common + backend |
| `bun run build:frontend` | Build common + frontend |
| `bun run start:backend` | Start the production backend build |
| `bun run validate-data` | Validate catalog / data scripts |

## Project layout

```
common/     Shared domain types and API contracts
backend/    API (domain, application, infrastructure)
frontend/   React SPA (domain, application, UI)
docs/       Operator docs (e.g. production deploy)
```

Hexagonal architecture with vertical slices by business module. Dependencies flow inward: Infrastructure → Application → Domain.

## Documentation

- **[docs/deploy.md](docs/deploy.md)** — Production deploy (Railway API + Vercel SPA)
- **[.env.example](.env.example)** — Environment variable reference
