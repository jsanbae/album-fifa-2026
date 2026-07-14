## Why

Branding for the FIFA World Cup 2026 tournament emblem is split across modules with duplicated markup and misleading names. `SignInBranding` (shared) inlines its own `<img>` and tilt wiring, while `WorldCupLogoTilt` (catalog) renders the same PNG with overlapping size variants but no tilt — despite its name. The tournament emblem is a cross-cutting brand asset, not catalog-specific logic. Consolidating it in `shared` removes duplication, clarifies module boundaries, and makes `catalog` a consumer of shared shell UI rather than a parallel owner of the same asset.

## What Changes

- Introduce a single `WorldCupEmblem` component in `shared/infrastructure/ui/components/` with `compact` and `hero` variants
- Support optional interactive tilt via an `interactive` prop (used on sign-in; static on dashboard)
- Extract `usePrefersReducedMotion` hook to shared to DRY reduced-motion handling
- Refactor `SignInBranding` to compose `WorldCupEmblem` instead of inline emblem markup
- Update `StickerListPage` to import `WorldCupEmblem` from shared
- Remove `WorldCupLogoTilt` from the catalog module (component + CSS)
- Consolidate and rename tests (`WorldCupEmblem.test.tsx`); keep `SignInBranding` tests focused on hierarchy

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `album-ui`: Add shared World Cup emblem component requirement (structural; no user-visible behavior change)

## Impact

- `frontend/src/shared/infrastructure/ui/components/WorldCupEmblem/` — new shared component
- `frontend/src/shared/infrastructure/ui/hooks/usePrefersReducedMotion.hook.ts` — new hook
- `frontend/src/shared/infrastructure/ui/components/SignInBranding/` — compose shared emblem
- `frontend/src/catalog/infrastructure/ui/pages/StickerListPage.tsx` — import from shared
- `frontend/src/catalog/infrastructure/ui/components/WorldCupLogoTilt.*` — deleted
- `frontend/tests/WorldCupLogoTilt.test.tsx` → `WorldCupEmblem.test.tsx`
- `frontend/tests/SignInBranding.test.tsx` — tilt tests move to emblem tests where appropriate
