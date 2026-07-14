## Context

The monorepo (`common`, `backend`, `frontend`) ships a FIFA World Cup 2026 sticker-album tracker on TypeScript/Bun with Supabase auth/data. Local run uses `bun run dev`; production is Railway (API) + Vercel (SPA) as documented in `docs/deploy.md`. Agent workflow lives in `AGENTS.md`. There is no root `README.md`.

## Goals / Non-Goals

**Goals:**

- Provide a concise root README for humans cloning the repo
- Cover overview, prerequisites, env setup, local run, useful scripts, high-level layout, and links to deploy/agent docs
- Stay accurate to current `package.json` scripts and `.env.example`

**Non-Goals:**

- Rewriting `AGENTS.md` or `docs/deploy.md`
- Changing application code, CI, or deployment config
- Publishing a changelog or contributing guide beyond a short pointer if needed

## Decisions

1. **Single root README, English**
   - Matches project language rules and GitHub defaults.
   - Alternative: Spanish README — rejected; code/docs are English.

2. **Summarize + link, do not duplicate**
   - Local setup and scripts live in README; full Railway/Vercel runbook stays in `docs/deploy.md`; XP/TDD/agent rules stay in `AGENTS.md`.
   - Alternative: one mega-README — rejected; would drift from specialized docs.

3. **Prerequisites call out Bun + Supabase project**
   - Reflects real blockers for first-time setup from `.env.example`.

4. **Document scripts that exist today**
   - `dev`, `test`, `lint`, `build`, `build:backend` / `build:frontend`, `start:backend`, `validate-data`.
   - Do not invent scripts.

## Risks / Trade-offs

- **[Risk] README drifts from scripts/env** → Mitigation: keep content tied to `package.json` and `.env.example`; prefer links for long procedures.
- **[Risk] Overlap with AGENTS.md confuses agents vs humans** → Mitigation: README is user-facing; one short “For AI agents” link to `AGENTS.md`.

## Migration Plan

- Add `README.md` at repo root; no deploy steps required.
- Rollback: delete the file.

## Open Questions

- None — content can be derived from existing project files.
