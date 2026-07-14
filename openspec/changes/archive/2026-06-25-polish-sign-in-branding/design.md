## Context

The sign-in card (`SignInForm`) currently renders:

1. `h1` "Album FIFA 2026" (page-title size, 1.75rem)
2. FIFA WC 2026 logo (`WorldCupLogoTilt` hero, ~9rem)
3. Panini logo (~6rem wide)
4. Subtitle
5. Mode toggle + form

Card-level 3D tilt (`useTilt3D`, 8° max) wraps the entire glass card. `DESIGN.md` centers auth card content and rates motion at 5/10. `PRODUCT.md` demands restraint — decoration supports trust, not hype.

`SignInForm` imports `WorldCupLogoTilt` from the `catalog` module, which violates the intended dependency flow (shared shell should not depend on catalog).

## Goals / Non-Goals

**Goals:**

- Establish a single branded header region with unambiguous hierarchy
- Make the FIFA WC 2026 emblem the visual hero; title supports it at section-heading scale
- Position Panini as publisher credit (smaller, muted) after the subtitle
- Improve spacing rhythm and separate brand block from interactive form controls
- Colocate branding in `shared/infrastructure/ui/` — no catalog imports in `SignInForm`
- Preserve card tilt, reduced-motion fallback, and existing auth behavior

**Non-Goals:**

- Changing auth flows, copy, or Supabase integration
- Adding new brand assets or animations beyond existing card tilt
- Redesigning the collection dashboard header
- Renaming `WorldCupLogoTilt` globally (dashboard may keep using it)

## Decisions

### 1. New `SignInBranding` component in shared

Create `shared/infrastructure/ui/components/SignInBranding/SignInBranding.tsx` + `.module.css`.

**Rationale:** Branding is auth-shell concern, not catalog. Extracting it simplifies `SignInForm` and removes the catalog dependency.

**Structure:**

```
┌─────────────────────────────────┐
│      [FIFA WC 2026 emblem]      │  hero (~8–9rem)
│       Album FIFA 2026           │  1.125rem, weight 700
│  Sign in to track your...       │  0.875rem, Fog Label
│         [Panini mark]           │  ~5.5rem, muted, margin-top
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │  subtle divider (optional glass border)
└─────────────────────────────────┘
         mode toggle + form
```

### 2. Hierarchy: emblem over title

Move `h1` below the FIFA emblem but reduce to `1.125rem` (between section heading and page title). The emblem remains the largest element.

**Alternative:** Remove title text entirely — rejected; screen readers and landmark need the app name in text.

The outer `SignInForm` keeps `aria-labelledby` on the `h1` inside `SignInBranding`.

### 3. Panini as publisher credit

Place Panini **after** the subtitle, not between emblem and title.

- Max width ~5.5rem (smaller than current ~6–10rem)
- `opacity: 0.9` or `--text-secondary-color` treatment via CSS filter is unnecessary — use smaller size + secondary context spacing
- `alt="Panini"` preserved
- No additional marketing copy ("Official album") in this change

**Rationale:** Panini is the album publisher, not a co-equal tournament brand. Subtitle explains purpose; Panini anchors publisher trust quietly.

### 4. Spacing and divider

- Brand block internal gap: `0.5rem` between emblem ↔ title, `0.375rem` title ↔ subtitle, `0.75rem` subtitle ↔ Panini
- Brand block bottom margin: `0.25rem` before divider
- Divider: `1px` glass border token, full width, `margin-bottom: 0.25rem` — separates brand from mode toggle
- Card `gap` between brand block and controls: rely on divider + existing `1rem` card gap

### 5. FIFA emblem sourcing

`SignInBranding` uses a plain `<img src="/world-cup-2026-logo.png">` with hero sizing in its own CSS — does not import `WorldCupLogoTilt`.

**Rationale:** Sign-in logo is static; avoids catalog coupling. Dashboard keeps `WorldCupLogoTilt` as-is.

### 6. Card tilt unchanged

No changes to `useTilt3D` integration in `SignInForm`. Tilt stays on the card at 8°.

**Future consideration (out of scope):** restrict tilt to `pointer: fine` media query so touch users don't get accidental tilt while tapping inputs.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Title too small vs emblem | Test at 375px; ensure title remains readable (≥1rem) |
| Duplicate FIFA img markup vs `WorldCupLogoTilt` | Acceptable; shared sign-in branding is independent of dashboard component |
| Divider adds visual noise | Use existing glass border token; skip if it feels heavy in review |
| Panini too subtle | Size floor ~5rem; user can ask to enlarge in follow-up |

## Migration Plan

1. TDD: failing tests for brand block order and element presence
2. Create `SignInBranding` component + styles
3. Refactor `SignInForm` to compose `SignInBranding`; remove catalog imports
4. Tune spacing at 375px viewport
5. Run frontend tests, lint, build

## Open Questions

- None
