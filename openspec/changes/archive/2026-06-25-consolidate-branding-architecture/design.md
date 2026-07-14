## Context

Hexagonal architecture groups code by business module with dependencies flowing inward. The `shared` module hosts app-shell concerns (auth UI, cross-cutting hooks). The `catalog` module owns sticker browsing. Both surfaces display the same FIFA World Cup 2026 PNG emblem:

| Location | Current implementation | Tilt |
|----------|------------------------|------|
| Sign-in (`SignInBranding`) | Inline `<img>` + `useTilt3D` | Yes (emblem only) |
| Dashboard (`StickerListPage`) | `WorldCupLogoTilt` in catalog | No (static) |

Problems:

1. **Duplication** — logo src, alt text, and size variants defined twice
2. **Misleading name** — `WorldCupLogoTilt` implies tilt but is static
3. **Wrong module** — tournament emblem is brand shell UI, not catalog domain
4. **DRY violation** — `prefersReducedMotion` listener duplicated in `SignInBranding`

`FifaIcon` (SVG wordmark for list rows) stays in catalog — it is a different asset for group labels, not the tournament emblem.

## Goals / Non-Goals

**Goals:**

- Single `WorldCupEmblem` component in shared with `variant` (`compact` | `hero`) and `interactive` (tilt on/off)
- `SignInBranding` composes `<WorldCupEmblem variant="hero" interactive />` — no inline emblem markup
- `StickerListPage` uses `<WorldCupEmblem variant="compact" />` from shared
- Extract `usePrefersReducedMotion` hook for reuse by interactive emblem
- Delete catalog `WorldCupLogoTilt` without behavior regression
- Preserve existing visual sizes, tilt angles (8°), and reduced-motion policy

**Non-Goals:**

- Changing sign-in branding hierarchy (title, subtitle, Panini placement)
- Adding dashboard emblem tilt
- Moving `FifaIcon` / `CocaColaIcon` (catalog-specific group icons)
- Creating a new top-level `common` frontend package

## Decisions

### 1. `WorldCupEmblem` in shared

Path: `shared/infrastructure/ui/components/WorldCupEmblem/WorldCupEmblem.tsx` + `.module.css`

```tsx
interface WorldCupEmblemProps {
  variant?: 'compact' | 'hero';
  interactive?: boolean;
  testId?: string; // optional, default 'world-cup-emblem' for tilt surface when interactive
}
```

When `interactive` is true: wire `useTilt3D` + `usePrefersReducedMotion`, expose `data-testid="world-cup-emblem-tilt"` on tilt surface (replacing `sign-in-emblem-tilt` — update tests).

When `interactive` is false: static emblem, no pointer handlers.

**Rationale:** One component, two consumers, clear prop API. Catalog imports shared infrastructure (allowed — infrastructure depends on shared shell).

**Alternative:** Keep two components — rejected; perpetuates duplication.

### 2. Rename from `WorldCupLogoTilt` to `WorldCupEmblem`

Drop "Tilt" from the name; tilt is optional behavior, not identity.

**Alternative:** `TournamentLogo` — rejected; "World Cup" matches existing alt text and spec language.

### 3. `usePrefersReducedMotion` hook

```ts
// shared/infrastructure/ui/hooks/usePrefersReducedMotion.hook.ts
export function usePrefersReducedMotion(): boolean
```

Listens to `matchMedia('(prefers-reduced-motion: reduce)')` with change listener. Used by `WorldCupEmblem` when interactive.

Remove inline `prefersReducedMotion` helper from `SignInBranding`.

### 4. CSS consolidation

Migrate sizing from both `WorldCupLogoTilt.module.css` and `SignInBranding.module.css` emblem rules into `WorldCupEmblem.module.css`:

- `compact`: 4rem / 4.5rem at 30rem+ (dashboard header)
- `hero`: 8.5rem / 9rem at 30rem+ (sign-in)

Tilt surface styles (`perspective`, `transform`, transitions) live in `WorldCupEmblem.module.css` when interactive.

Remove emblem-specific CSS from `SignInBranding.module.css`.

### 5. Test file organization

| File | Responsibility |
|------|----------------|
| `WorldCupEmblem.test.tsx` | Variants, static render, interactive tilt, reduced motion |
| `SignInBranding.test.tsx` | Hierarchy order, divider, Panini placement (no tilt — delegated to emblem) |
| `tilt3d` / `useTilt3D` tests | Stay in `WorldCupEmblem.test.tsx` or split to `useTilt3D.test.ts` — keep hook tests with emblem file for minimal churn |

Update `SignInBranding` tilt tests to use `WorldCupEmblem` via `SignInBranding` integration OR remove and rely on `WorldCupEmblem` unit tests + one SignInBranding smoke test that emblem is present. Prefer moving tilt tests to `WorldCupEmblem.test.tsx` and keeping one `SignInBranding` test that `interactive` emblem is rendered (via role img).

### 6. Catalog cleanup

Delete:

- `catalog/infrastructure/ui/components/WorldCupLogoTilt.tsx`
- `catalog/infrastructure/ui/components/WorldCupLogoTilt.module.css`

Update `StickerListPage` import:

```ts
import { WorldCupEmblem } from '../../../../shared/infrastructure/ui/components/WorldCupEmblem/WorldCupEmblem.js';
```

Use relative path consistent with existing cross-module imports in the frontend.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Relative import path from catalog → shared is verbose | Matches existing frontend patterns; no new alias config in this change |
| Test id rename breaks tests | Update `sign-in-emblem-tilt` → `world-cup-emblem-tilt` consistently |
| Visual regression on sizes | Port exact CSS values from both sources; run existing tests |
| SignInBranding loses direct tilt control | `interactive` prop on composed emblem preserves behavior |

## Migration Plan

1. TDD: `WorldCupEmblem` tests (static + interactive)
2. Implement `usePrefersReducedMotion` + `WorldCupEmblem`
3. Refactor `SignInBranding` to compose emblem
4. Switch `StickerListPage` to shared import
5. Delete catalog `WorldCupLogoTilt`; rename test file
6. Trim `SignInBranding` tests; run full frontend validation

## Open Questions

- None
