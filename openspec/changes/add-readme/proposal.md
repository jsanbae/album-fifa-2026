## Why

The repository has no root `README.md`. New contributors and operators lack a single entry point for what the app is, how to run it locally, and where to find deploy or agent guidance.

## What Changes

- Add a root `README.md` covering product overview, stack, prerequisites, local setup, common scripts, project layout, and links to deeper docs (`docs/deploy.md`, `AGENTS.md`, `.env.example`)
- Keep agent workflow detail in `AGENTS.md` — the README links there rather than duplicating it
- Keep production deploy steps in `docs/deploy.md` — the README links there rather than duplicating the full runbook

## Capabilities

### New Capabilities

- `project-docs`: Root README as the human-facing entry for product purpose, local development setup, scripts, and pointers to deploy/agent docs

### Modified Capabilities

- (none)

## Impact

- **Repo root**: new `README.md` only
- **No runtime, API, or UI changes**
- **AGENTS.md** and **docs/deploy.md** remain the detailed sources; README summarizes and links
