## Context

`StickerListRow` renders each sticker with a country flag or group icon, country/group name (`countryName` CSS class), sticker id and name, and increment/decrement count controls. The `count` prop is already passed from the collection hook.

The Duplicates filter (count `>= 2`) was added recently, but the design explicitly deferred inline duplicate indicators. Users still need a visual cue in the default **All** view to spot extras without activating the Duplicates filter.

## Goals / Non-Goals

**Goals:**

- Show a compact **Duplicate** badge immediately after the country/group name when `count >= 2`
- Hide the badge when `count` is `0` or `1`
- Match existing dark UI tokens (CSS Modules, design system variables)
- Accessible label for screen readers (`aria-label` or visible text)
- TDD: failing component tests first in `StickerListRow.test.tsx`

**Non-Goals:**

- Displaying the extra quantity inside the badge (e.g. `×3`) — count controls already show total
- Sorting or grouping duplicates separately in the list
- Backend or domain changes
- Badge on section headers or filter chips

## Decisions

### 1. Inline badge next to country/group name

Wrap the country/group name and badge in a horizontal flex row inside `.details`:

```tsx
<span className={styles.nameRow}>
  <span className={styles.countryName}>{label}</span>
  {props.count >= 2 && (
    <span className={styles.duplicateBadge} aria-label="Duplicate">Duplicate</span>
  )}
</span>
```

**Rationale:** Matches the annotated placement in the mockup (right of "FIFA World Cup" / country name). Keeps sticker meta line unchanged.

**Alternative considered:** Badge on the count control — rejected because it duplicates information already shown as a number.

### 2. Threshold `count >= 2`

Align with collection domain and Duplicates filter definition (one owned copy plus at least one extra).

### 3. Label text: "Duplicate"

Static pill text **Duplicate** (not `+1` or `×{count}`).

**Rationale:** Clear, short, and works for any count `>= 2` without updating badge content on every increment. Total quantity remains in the counter.

**Alternative considered:** `×{count - 1}` extras — deferred; adds noise and overlaps with the counter.

### 4. Visual style

Small uppercase or semi-bold pill using existing tokens:

- Background: semi-transparent accent (e.g. `color-mix` on `--link-color` or a warm amber for swap visibility)
- Font size: `0.6875rem` (11px) — smaller than country name
- Padding: `0.125rem 0.375rem`, `border-radius: 0.25rem`
- `flex-shrink: 0` so the badge does not collapse on narrow viewports

**Rationale:** Subtle but scannable; does not use the primary button blue reserved for controls.

### 5. No new shared component

Implement in `StickerListRow` only. A reusable `Badge` is unnecessary for a single use case.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Badge crowds long country names on 375px | `nameRow` uses `flex-wrap: wrap`; country name can truncate with existing `min-width: 0` on `.details` |
| Redundant with Duplicates filter | Intentional — badge aids browsing in All view; filter aids focused review |
| Badge visible for unauthenticated users with count 0 | Badge is driven by `count` prop; unauthenticated users always see count 0, so badge never shows |

## Migration Plan

1. Add failing tests in `StickerListRow.test.tsx` (badge visible at count 2, hidden at count 1)
2. Update `StickerListRow.tsx` and `StickerListRow.module.css`
3. Run frontend tests and validation

No data migration or feature flags.

## Open Questions

- None
