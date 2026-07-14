## Why

The app is ready to share with real collectors, but there is no production deployment path. Hosting the Express/Bun API on Railway and the Vite SPA on Vercel (option A) gives a simple, cost-effective split that matches how the monorepo already separates backend and frontend.

## What Changes

- Add **Railway** deployment config so the Bun backend builds and starts from the monorepo root
- Add **Vercel** deployment config so the frontend SPA builds with correct `VITE_*` env vars and SPA rewrites
- Document production environment variables and Supabase Auth redirect URLs for both hosts
- Ensure the backend is production-safe: health check remains available; `CORS_ORIGIN` must point at the Vercel origin; `DEV_USER_ID` must not be required in production
- Update `.env.example` with production-oriented guidance (no secrets committed)

## Capabilities

### New Capabilities

- `deployment`: Production hosting for API (Railway) and SPA (Vercel), including build/start commands, env contracts, and CORS/origin requirements

### Modified Capabilities

- (none — runtime API and UI behavior unchanged)

## Impact

- **Repo root**: `railway.toml` / Nixpacks hints, `vercel.json`, deployment docs
- **Backend**: Start/build scripts used by Railway; optional listen-on-`0.0.0.0` if needed for Railway routing
- **Frontend**: Vercel project root/`frontend` build; `VITE_API_URL` must point at the Railway public URL at build time
- **Supabase**: Site URL and redirect allow-list must include the Vercel production (and preview) origins
- **Ops**: Operators set Railway and Vercel env vars; no new app features
