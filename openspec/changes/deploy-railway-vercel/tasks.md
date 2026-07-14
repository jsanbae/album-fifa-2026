## 1. Railway backend

- [x] 1.1 Add `railway.toml` (and Nixpacks/Bun hints if needed) with monorepo build of common+backend and backend start command
- [x] 1.2 Bind Express listen host to `0.0.0.0` for platform networking; keep `PORT` from env
- [x] 1.3 Add/confirm e2e coverage for `GET /health`

## 2. Vercel frontend

- [x] 2.1 Add root `vercel.json` with install/build/output for the SPA and client-route fallback

## 3. Production environment documentation

- [x] 3.1 Extend `.env.example` with Railway / Vercel / Supabase production guidance
- [x] 3.2 Add `docs/deploy.md` with first-deploy order and smoke-test checklist
