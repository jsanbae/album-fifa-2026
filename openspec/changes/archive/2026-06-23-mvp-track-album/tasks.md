## 1. Data preparation

- [x] 1.1 Fix trailing comma in `data/stickers.json` so it parses as valid JSON
- [x] 1.2 Create `data/countries.json` with all 48 FIFA country codes, Spanish names, and ISO flag codes (including ENG, SCO)
- [x] 1.3 Add JSON validation script for sticker invariants (unique ids, country-group consistency, 990 total)

## 2. Monorepo scaffold

- [x] 2.1 Create root `package.json` with npm workspaces (`common`, `backend`, `frontend`)
- [x] 2.2 Scaffold `common` package with shared types (DomainError, Maybe, API route constants)
- [x] 2.3 Scaffold `backend` package with TypeScript, test runner, ESLint, and dev server entry point
- [x] 2.4 Scaffold `frontend` package with React, TypeScript, Vite, test runner, and CSS Modules
- [x] 2.5 Add root scripts: `build`, `test`, `lint`, `dev` (backend + frontend)
- [x] 2.6 Add `.env.example` documenting Supabase URL, anon key, and service role key

## 3. Catalog module (domain + application, TDD)

- [x] 3.1 Create `StickerNumber` value object with validation tests
- [x] 3.2 Create `Album`, `Group`, `Country`, `Sticker` entities with factory methods and unit tests
- [x] 3.3 Define `CatalogRepository` port and `InMemoryCatalogRepository` with seed from JSON
- [x] 3.4 Implement `ListStickersUseCase` with group filter and id prefix search (unit tests)
- [x] 3.5 Implement `ListCountriesUseCase` and `ListGroupsUseCase` (unit tests)
- [x] 3.6 Create catalog DTOs and mappers (sticker with optional country name and isoCode)

## 4. Catalog module (infrastructure)

- [x] 4.1 Implement `JsonFileCatalogRepository` loading `data/stickers.json` and `data/countries.json` (integration test)
- [x] 4.2 Create Supabase migration SQL for `albums`, `groups`, `countries`, `stickers` tables
- [x] 4.3 Implement catalog seeder script (idempotent upsert from JSON)
- [ ] 4.4 Implement `SupabaseCatalogRepository` (integration test)
- [x] 4.5 Create catalog HTTP controller: `GET /api/catalog/stickers`, `/countries`, `/groups` (e2e test)
- [x] 4.6 Wire catalog module in backend factory

## 5. Collection module (domain + application, TDD)

- [x] 5.1 Create `UserId` value object and `CollectionEntry` entity with count validation (unit tests)
- [x] 5.2 Define `CollectionRepository` port and `InMemoryCollectionRepository` (unit tests)
- [x] 5.3 Implement `GetCollectionUseCase` (unit tests)
- [x] 5.4 Implement `IncrementStickerCountUseCase`, `DecrementStickerCountUseCase`, `SetStickerCountUseCase` (unit tests)
- [x] 5.5 Implement `GetCollectionProgressUseCase` — owned = stickers with count >= 1, total = 990 (unit tests)
- [x] 5.6 Create collection DTOs

## 6. Collection module (infrastructure)

- [x] 6.1 Create Supabase migration for `collection_entries` table with PK (user_id, sticker_id)
- [x] 6.2 Implement `SupabaseCollectionRepository` (integration test)
- [x] 6.3 Add Supabase Auth middleware extracting `UserId` from JWT
- [x] 6.4 Create collection HTTP controller: `GET /api/collection`, `GET /api/collection/progress`, increment/decrement/set endpoints (e2e test)
- [x] 6.5 Merge collection counts into sticker list response for authenticated requests
- [x] 6.6 Wire collection module in backend factory

## 7. Frontend — shared and catalog

- [x] 7.1 Create `HttpClient` adapter and API types in frontend shared layer
- [x] 7.2 Create catalog store hook (fetch stickers, countries, groups)
- [x] 7.3 Create `CountryFlag` component using `country-flag-icons` SVG (tests for ENG, SCO, MEX)

## 8. Frontend — album UI

- [x] 8.1 Create `ProgressBar` component showing owned / 990
- [x] 8.2 Create `FilterChips` component (All, Missing, groups, FIFA World Cup, Coca-Cola)
- [x] 8.3 Create `StickerSearch` input filtering by id prefix
- [x] 8.4 Create `StickerListSection` with group headers in defined order
- [x] 8.5 Create `StickerListRow` with flag, country name, id, name, and count controls (CSS Modules)
- [x] 8.6 Create `StickerListPage` composing progress, filters, search, and virtualized or scrollable list
- [x] 8.7 Integrate Supabase Auth (login flow); disable count controls when unauthenticated
- [x] 8.8 Wire count controls to collection API with optimistic updates
- [x] 8.9 Add loading and error states

## 9. Integration and validation

- [x] 9.1 Run full test suite (`build`, `lint`, `test`) across all packages
- [ ] 9.2 Seed Supabase with catalog data and verify 990 stickers via API
- [x] 9.3 Manual smoke test: browse list, filter by Grupo A, search MEX, increment/decrement counts, verify progress updates
