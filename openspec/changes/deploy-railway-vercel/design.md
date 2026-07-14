## Context

The monorepo has a Bun/Express API (`backend`) and a Vite React SPA (`frontend`). Supabase holds auth and persistence. There is no Railway or Vercel project config in-repo yet (only a local `.vercel` link). Option A: API on Railway, SPA on Vercel.

## Goals / Non-Goals

**Goals:**

- Reproducible Railway build/start for `@album/backend` (and `@album/common` workspace dep)
- Reproducible Vercel build for `@album/frontend` with SPA fallback
- Clear production env contract (Railway vs Vercel vs Supabase dashboard)
- Backend listens on Railway’s `PORT` and is reachable on all interfaces

**Non-Goals:**

- Serving the SPA from Express
- Docker multi-service compose
- CI/CD pipelines beyond what Railway/Vercel git deploy provide
- Changing auth, catalog, or collection business logic

## Decisions

1. **Split hosting (Railway API + Vercel SPA)**  
   - *Why*: Matches existing architecture; Bun/Express is a long-lived process (Railway); static assets fit Vercel.  
   - *Alt*: Single Railway service serving SPA — rejected for option A.

2. **Monorepo root as Railway root**  
   - Build: install with Bun, build `common` then `backend`.  
   - Start: `bun run --filter @album/backend start` (or equivalent).  
   - *Why*: Workspace linking requires root `package.json` / `bun.lock`.

3. **Vercel root = repository root with `frontend` as app**  
   - Use `vercel.json` (or project settings) to set install/build/output for the SPA while resolving `@album/common` from workspaces.  
   - *Why*: Vite `envDir` already points at monorepo root; `VITE_*` can be set in Vercel env.

4. **CORS via `CORS_ORIGIN`**  
   - Production Railway sets `CORS_ORIGIN` to the Vercel origin (exact URL).  
   - *Why*: Existing middleware already uses this variable.

5. **No code change to health endpoint**  
   - Keep `GET /health` for Railway healthchecks.  
   - Bind listen host to `0.0.0.0` if default localhost-only would break Railway (Bun/Node typically bind all interfaces; verify and fix if needed).

6. **Docs in `.env.example` + short `docs/deploy.md` (or section in README if present)**  
   - *Why*: Operators need Railway/Vercel/Supabase checklist without guessing.

## Risks / Trade-offs

- **[Risk] `VITE_API_URL` baked at build time** → Rebuild Vercel after Railway URL is known; document order of first deploy.  
- **[Risk] CORS misconfig blocks browser calls** → Document exact `CORS_ORIGIN` (scheme + host, no trailing slash mismatch).  
- **[Risk] Bun/Nixpacks on Railway** → Prefer explicit `railway.toml` / Nixpacks bun override so Node is not assumed.  
- **[Risk] Preview deployments need extra CORS origins** → v1: document production only; optional comma-separated origins later if needed.  
- **[Risk] `DEV_USER_ID` left in Railway** → Document: unset in production.

## Migration Plan

1. Push branch with config + docs.  
2. Create Railway service from repo; set Supabase + `CORS_ORIGIN` (placeholder until Vercel URL exists).  
3. Deploy backend; note public HTTPS URL.  
4. Create/configure Vercel project; set `VITE_API_URL`, Supabase `VITE_*`; deploy.  
5. Update Railway `CORS_ORIGIN` and Supabase Auth Site URL / Redirect URLs to Vercel origin.  
6. Smoke-test: `/health`, sign-in, load stickers, collection mutation.  
7. Rollback: pin previous Railway/Vercel deployments; no DB migration in this change.

## Open Questions

- None for v1 (production single origin). Preview CORS can be a follow-up.
