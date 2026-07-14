# Deploy: Railway (API) + Vercel (SPA)

Option A splits hosting: the Bun/Express backend runs on Railway; the Vite React frontend is a static SPA on Vercel. Supabase remains the auth/data platform.

## Prerequisites

- Railway account + new empty service linked to this Git repo (root directory)
- Vercel account + project linked to the same repo
- Supabase project with Auth URL config you can edit

## 1. Deploy the API on Railway

1. Create a service from this repository (root = repo root).
2. Railway picks up `railway.toml` / `nixpacks.toml`:
   - **Build:** `bun run build:backend`
   - **Start:** `bun run start:backend`
   - **Healthcheck:** `GET /health`
3. Set Railway variables (no `VITE_*` here):

   | Variable | Value |
   |---|---|
   | `SUPABASE_URL` | Supabase project URL |
   | `SUPABASE_PUBLISHABLE_KEY` | Publishable / anon key |
   | `SUPABASE_SECRET_KEY` | Secret / service-role key |
   | `CORS_ORIGIN` | Exact Vercel origin after the SPA exists, e.g. `https://your-app.vercel.app` (set after step 2 if needed) |
   | `PORT` | Do not set (Railway injects it) |

4. Do **not** set `DEV_USER_ID` in production.
5. Deploy and copy the public HTTPS API origin (e.g. `https://….up.railway.app`).
6. Confirm: `GET https://<api>/health` → `{ "status": "ok" }`.

## 2. Deploy the SPA on Vercel

1. Import the same repo. Root directory stays the monorepo root (`vercel.json` is at root).
2. Ensure Bun is used (repo `packageManager` field is `bun@…`).
3. Set Vercel **build** environment variables:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Railway API origin from step 1 (no trailing slash) |
   | `VITE_SUPABASE_URL` | Same Supabase URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable / anon key |

4. Deploy. Copy the production origin (e.g. `https://your-app.vercel.app`).

## 3. Wire origins

1. Railway: set `CORS_ORIGIN` to the Vercel production origin (exact match, typically no trailing slash) and redeploy if needed.
2. Supabase → Authentication → URL Configuration:
   - **Site URL:** Vercel production origin
   - **Redirect URLs:** include that origin and `…/`
3. Supabase → Authentication → Providers → **Google** (required for Sign in with Google):
   - Create an OAuth 2.0 Web client in Google Cloud Console
   - Set Authorized redirect URI to `https://<project-ref>.supabase.co/auth/v1/callback`
   - Enable Google in Supabase and paste the Client ID and Client Secret there (not in Vercel/Railway env)
4. Rebuild the Vercel project if `VITE_API_URL` changed after the first frontend deploy.

## Smoke-test checklist

- [ ] `GET /health` on Railway returns 200
- [ ] Open the Vercel URL; sign-in / sign-up works (Supabase redirects back)
- [ ] **Sign in with Google** returns to the app authenticated (provider enabled + SPA origin allow-listed)
- [ ] Catalog stickers load (browser Network → Railway API, no CORS error)
- [ ] Collection increment/decrement works while authenticated

## Local vs production

| Concern | Local | Production |
|---|---|---|
| Frontend | `bun run dev` (Vite `:5173`) | Vercel |
| API | `bun run --filter @album/backend dev` (`:3005`) | Railway |
| `VITE_API_URL` | `http://localhost:3005` | Railway HTTPS origin |
| `CORS_ORIGIN` | `http://localhost:5173` | Vercel HTTPS origin |
| `DEV_USER_ID` | Optional for unsigned local use | Unset |

## Rollback

Pin / redeploy the previous successful Railway and Vercel deployments. This change does not migrate database schema.
