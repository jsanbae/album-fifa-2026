## Context

Greenfield FIFA World Cup 2026 sticker album tracker. Reference data exists in `data/stickers.json` (990 stickers across tournament groups, FIFA World Cup section, and Coca-Cola promo section). Country display requires a new `data/countries.json` with Spanish names and ISO codes for flag rendering. The codebase follows hexagonal architecture with TDD (inside-out), TypeScript monorepo, and Supabase Postgres for persistence.

**Sticker data model (from JSON):**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Primary key: `00`, `FWC1`, `MEX3`, `CC14`, etc. |
| `name` | string | Spanish sticker name |
| `countryId` | string \| null | FIFA 3-letter code; null for FWC/Coca-Cola/`00` |
| `group` | string | `FIFA World Cup`, `Grupo A`–`Grupo L`, `Coca-Cola` |

**Collection semantics:** `count` per sticker per user — `0` missing, `1` in album, `2+` duplicates.

## Goals / Non-Goals

**Goals:**

- Monorepo with `common`, `backend`, `frontend` and shared test/lint tooling
- Catalog module: seed and serve stickers, countries, groups for the single FIFA 2026 album
- Collection module: CRUD sticker counts per authenticated user; progress = stickers with `count >= 1` / 990
- Mobile-first list UI with country flag (SVG), country name, section grouping, filters, search by sticker id
- TDD throughout: InMemory repositories first, Supabase adapters second
- Valid, parseable `data/stickers.json`

**Non-Goals:**

- Trading, offline/PWA sync, multi-album, duplicate trading UI
- Inferring country on Coca-Cola promo stickers
- i18n beyond Spanish names from source data

## Decisions

### 1. Monorepo layout (npm workspaces)

```
album-fifa-2026/
├── package.json          # workspaces: common, backend, frontend
├── common/
├── backend/
├── frontend/
└── data/
    ├── stickers.json
    └── countries.json
```

**Rationale:** Matches `AGENTS.md` structure; shared types in `common` for API contracts.

**Alternative:** Separate repos — rejected; unnecessary for MVP.

### 2. Module slicing: `catalog` and `collection`

```
catalog/     → Album, Group, Country, Sticker (read-only reference)
collection/  → CollectionEntry (userId, stickerId, count)
```

Collection imports catalog domain types (`Sticker`, `Country`) only — not use cases or HTTP adapters.

**Rationale:** Clear bounded contexts; catalog is immutable reference data after seed.

### 3. Sticker primary key = official `id` string

`StickerNumber` value object wraps the JSON `id` exactly (`MEX3`, not normalized to integer).

**Rationale:** Matches physical album codes; search and collection keys stay consistent.

### 4. Country enrichment via `data/countries.json`

48 entries: `{ id, name, isoCode }` where `id` matches `countryId` in stickers. Spanish `name`. `isoCode` for flag SVG (including `gb-eng`, `gb-sct` for ENG/SCO).

**Rationale:** FIFA codes are not ISO; explicit mapping avoids runtime guesswork. Flag rendering stays in frontend infrastructure.

**Alternative:** Emoji flags — rejected (ENG/SCO broken, inconsistent on devices).

### 5. Flag display: `country-flag-icons` in frontend

`CountryFlag` component maps `isoCode` → SVG. Bundled for offline-readiness later.

**Rationale:** Crisp on mobile, small bundle for 48 flags.

### 6. Repository pattern and TDD order

1. Domain entities + value objects (tests)
2. Repository port + InMemory implementation (tests)
3. Use cases (tests)
4. `JsonFileCatalogRepository` loads seed JSON (integration test)
5. `SupabaseCatalogRepository` / `SupabaseCollectionRepository` (integration test)
6. HTTP controllers (e2e)

**Rationale:** Inside-out TDD per project guidelines; domain never depends on Supabase.

### 7. Catalog seeding

One-time seed from JSON → Supabase tables: `albums`, `groups`, `countries`, `stickers`. Single album row `fifa-2026`. Idempotent upsert on deploy/migrate.

InMemory/JSON adapters used in unit tests without DB.

### 8. Supabase schema (conceptual)

```sql
albums (id, name)
groups (id, album_id, name)
countries (id, album_id, group_id, name, iso_code)
stickers (id, album_id, name, country_id, group_id)
collection_entries (user_id, sticker_id, count, updated_at)
  PK (user_id, sticker_id)
```

`group` on stickers maps to `groups.id` (normalized: `A` from `Grupo A`, `fifa-world-cup`, `coca-cola`).

### 9. Auth: Supabase Auth minimal

JWT `sub` as `UserId`. Collection endpoints require auth. Catalog endpoints are public read.

**Rationale:** Multi-device persistence needs identity; catalog is public reference data.

**Alternative:** Anonymous local-only — rejected given Supabase choice.

### 10. API surface (REST)

| Method | Path | Module |
|--------|------|--------|
| GET | `/api/catalog/stickers` | List stickers (query: `group`, `missing`, `search`) |
| GET | `/api/catalog/countries` | List countries |
| GET | `/api/catalog/groups` | List groups |
| GET | `/api/collection` | User's collection with counts |
| GET | `/api/collection/progress` | `{ owned, total, percentage }` |
| PUT | `/api/collection/stickers/:id` | Set count `{ count }` |
| POST | `/api/collection/stickers/:id/increment` | +1 |
| POST | `/api/collection/stickers/:id/decrement` | -1 (floor 0) |

List stickers merges collection counts when authenticated.

### 11. Mobile list UI structure

- Sticky progress bar: `owned / 990`
- Filter chips: All, Missing, per Group, FIFA World Cup, Coca-Cola
- Search input: filter by sticker `id` prefix
- Section headers by `group` value
- Row: `[−] count [+]`, sticker id, country flag + name (if `countryId`), sticker name
- No flag for FWC/Coca-Cola/`00` rows

### 12. Section display order

1. FIFA World Cup (17)
2. Grupo A → Grupo L (80 each, Grupo K = 79)
3. Coca-Cola (14)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Invalid `stickers.json` (trailing comma) | Fix as first data task; add JSON schema validation in seed script |
| FIFA → ISO mapping errors | Hand-curate `countries.json`; test all 48 codes render a flag |
| Supabase setup friction | Document `.env`; InMemory path works without DB for dev |
| 990-row list performance on mobile | Virtualized list if needed; likely fine for MVP |
| Auth blocks quick local demo | Support dev bypass or test user in local env only |

## Migration Plan

1. Fix `data/stickers.json` syntax
2. Add `data/countries.json`
3. Scaffold monorepo; verify tests run
4. Implement catalog (InMemory → JSON → Supabase seed)
5. Implement collection (InMemory → Supabase)
6. Frontend against API
7. Deploy backend + frontend; run seed migration against Supabase

Rollback: catalog is immutable; collection table can be truncated per environment.

## Open Questions

- Email magic link vs OAuth providers for Supabase Auth (default: email)
- Virtualized list library choice (defer until perf issue observed)
