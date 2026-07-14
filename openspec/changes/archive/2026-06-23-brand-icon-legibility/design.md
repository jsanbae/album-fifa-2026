## Context

`GroupIcon` applies `.md { width: 1.5rem; height: auto }` — same width as `CountryFlag`. Country flags are ~3:2, so they render ~1rem tall. Brand logos are much wider:

```
Country flag (3:2)     @ 1.5rem wide  →  ~1.0rem tall  ✓ readable
Coca-Cola (200:48)     @ 1.5rem wide  →  ~0.36rem tall ✗ illegible
FIFA (88:24)           @ 1.5rem wide  →  ~0.41rem tall ✗ similar issue
```

The SVG paths also include padding inside a large `viewBox`, shrinking the visible artwork further.

## Goals / Non-Goals

**Goals:**

- Coca-Cola logo readable in `StickerListRow` at 375px viewport
- Preserve logo aspect ratio (no stretching)
- Height-align brand icons with the country flag slot
- Trim SVG viewBox margins on both brand icons

**Non-Goals:**

- Redesigning logo paths or colors
- Changing filter chip / section header icon sizes beyond proportional `sm` variant
- Icons for tournament groups

## Decisions

### 1. Height-based sizing for row icons (`md`)

Replace width-fixed sizing with height-fixed sizing aligned to the flag slot:

```css
/* GroupIcon.module.css — md (list rows) */
.md {
  height: 1rem;      /* matches CountryFlag placeholder height */
  width: auto;
  max-width: 3rem;   /* prevent overflow on narrow screens */
  flex-shrink: 0;
}
```

**Rationale:** Wide logos grow horizontally but fill the vertical slot users expect next to country flags.

**Alternative:** Increase width to 3rem — rejected; breaks row alignment and pushes text.

### 2. Trim SVG viewBox

Recalculate tight `viewBox` bounds around path content for:

- `CocaColaIcon`: crop from `0 0 200 48` to minimal bounding box
- `FifaIcon`: crop from `0 0 88 24` similarly

**Rationale:** User-requested margin reduction; more ink per pixel without distorting ratio.

### 3. Shared flag-slot height token

Extract `--flag-slot-height: 1rem` in `globals.css` (or reuse placeholder height from `CountryFlag.module.css`) so flag and brand icons stay aligned if either changes.

### 4. `sm` variant (chips / headers)

Keep `sm` height-based with `height: 0.875rem` and `max-width: 2.25rem` — proportional to `md`, not width-fixed.

### 5. No duplicate group label change

Row still shows "Coca-Cola" as text label beside the icon — icon legibility fix only; label unchanged.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Coke logo wider than flag slot | `max-width` on `.md` |
| viewBox crop clips stroke | Test with `getBBox` or visual check; pad viewBox by 1–2 units if needed |
| FIFA logo also changes size | Intended — same sizing strategy for consistency |

## Migration Plan

1. Failing tests asserting rendered height ≥ flag slot proportion
2. Trim viewBoxes
3. Update CSS sizing
4. Visual check on Coca-Cola rows (CC1–CC14) at 375px

## Open Questions

- None
