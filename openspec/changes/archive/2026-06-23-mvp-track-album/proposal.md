## Why

Collectors of the FIFA World Cup 2026 Panini album need a simple way to track which stickers they own, which are missing, and how many duplicates they have. The project has complete sticker reference data (`data/stickers.json`) but no application yet. This change delivers the minimum viable product: a mobile-first list to browse the full album and update per-sticker counts.

## What Changes

- Scaffold a TypeScript monorepo (`common`, `backend`, `frontend`) with hexagonal architecture and TDD tooling
- Introduce a **catalog** module seeded from `data/stickers.json` and `data/countries.json` (990 stickers, 48 countries, 14 groups/sections)
- Introduce a **collection** module where a user tracks `count` per sticker (0 = missing, 1+ = owned; 2+ = duplicates)
- Expose catalog and collection via HTTP API; persist collection in Postgres via Supabase
- Build a mobile-first React list UI with country name, flag, group/section filters, and increment/decrement controls
- Fix `data/stickers.json` trailing-comma syntax error so it parses as valid JSON

### Non-goals (deferred)

- Trading between users
- Offline / PWA sync
- Multi-album support
- Auth beyond a minimal Supabase user identity (can start with anonymous or email auth as needed for persistence)

## Capabilities

### New Capabilities

- `project-scaffold`: Monorepo structure, shared tooling, test runners, and dev scripts for backend and frontend
- `catalog`: Album reference data — stickers, countries (name + ISO flag code), groups/sections; load from JSON seed files
- `collection`: Per-user sticker counts, progress calculation, increment/decrement/set count
- `album-ui`: Mobile-first sticker list with country flag, country name, section headers, filters, and count controls

### Modified Capabilities

<!-- No existing specs -->

## Impact

- **New packages**: `common/`, `backend/`, `frontend/` with workspace root `package.json`
- **Data files**: `data/stickers.json` (existing), new `data/countries.json` (48 FIFA country codes with Spanish names and ISO flag codes)
- **Infrastructure**: Supabase Postgres for catalog seed and collection persistence; `.env` for connection config
- **Dependencies**: React, Node HTTP server, Supabase client, `country-flag-icons` (or equivalent) for SVG flags in frontend
- **Architecture**: Vertical slices `catalog` and `collection` modules following hexagonal layers per `AGENTS.md`
