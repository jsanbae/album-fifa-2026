## Context

`ProgressBar` renders the album-wide progress card at the top of `StickerListPage`. It currently shows stats as `owned / total` (e.g. `142 / 990`) and drives the visual fill from `percentage`. Section headers already use `formatGroupProgressLabel` (`owned / total (percentage%)`) via `groupProgress.ts`.

Collection progress DTO already includes `owned`, `total`, and `percentage` from `GetCollectionProgressUseCase` / `fetchProgress`. Optimistic updates in `useCollection` also recalculate `percentage`.

## Goals / Non-Goals

**Goals:**

- Display overall progress as `owned / total (percentage%)`, aligned with section header format
- Reuse existing `percentage` from progress DTO (rounded integer, clamped 0–100)
- Preserve progress bar fill behavior and `aria-*` attributes on the track
- Show a neutral placeholder when progress is unavailable: `— / total (—%)`
- TDD: failing tests first in `ProgressBar.test.tsx`

**Non-Goals:**

- Changing section header progress format
- Recomputing percentage on the frontend from owned/total (backend/hook already provide it)
- Adding a separate percentage-only stat line or changing progress bar visual design
- Backend or API changes

## Decisions

### 1. Reuse group progress label format

Extend `statsText` in `resolveProgressValues` to append `(percentage%)`:

```ts
statsText: `${owned} / ${total} (${percentage}%)`
```

When progress is unavailable:

```ts
statsText: `— / ${TOTAL_STICKERS} (—%)`
```

**Rationale:** Matches `formatGroupProgressLabel` in `groupProgress.ts` for visual consistency across the album UI.

**Alternative considered:** Extract a shared `formatProgressLabel(owned, total, percentage)` helper used by both `ProgressBar` and `groupProgress.ts` — deferred; only two call sites and group progress computes percentage locally while overall progress uses DTO value.

### 2. Use DTO percentage, not client-side recalculation

Use `clampPercentage(loaded.percentage)` from the progress DTO rather than deriving `Math.round((owned / total) * 100)` in the component.

**Rationale:** Keeps display in sync with optimistic updates in `useCollection`, which already adjusts `percentage` on increment/decrement.

### 3. No CSS layout change expected

The stats line may grow slightly in width (`(14%)` suffix). Existing `.stats` typography should accommodate this without wrapping issues on 375px viewports.

**Alternative considered:** Split count and percentage into two spans with muted percentage color — rejected; section headers use a single string, so consistency wins.

### 4. Accessibility unchanged structurally

Keep `aria-describedby` pointing at the stats element. The stats text naturally includes the percentage for screen readers.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Slight mismatch if DTO percentage drifts from owned/total | `useCollection` already keeps them in sync; tests assert displayed string |
| Longer stats string on narrow screens | Single line is still short; monitor in UX review if needed |
| Placeholder `—%` when loading | Consistent with existing `— / total` pattern for unavailable progress |

## Migration Plan

1. Add failing tests in `ProgressBar.test.tsx` for loaded and unavailable states
2. Update `resolveProgressValues` in `ProgressBar.tsx`
3. Run frontend tests and validation

No data migration or feature flags.

## Open Questions

- None
