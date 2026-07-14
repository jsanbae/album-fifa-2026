## Context

`StickerListSection` renders a static glass header (group icon + title) above a list of `StickerListRow` components. Grouping is done in `StickerListPage` via `groupStickers`. Collection counts come from `useCollection.getCount(stickerId)`; a sticker is considered owned when count > 0.

The user's screenshot highlights the right side of the header bar as the target area for per-group progress. The design system uses `Fog Label` for secondary text and `Complete Green` for completion states.

## Goals / Non-Goals

**Goals:**

- Toggle sticker rows visibility by clicking the section header
- Show per-group stats as `owned / total (percentage%)` in the header (e.g. `8 / 10 (80%)`)
- Default all sections to expanded on first render
- Update stats reactively when counts change or filters change the visible sticker set
- Accessible header: `aria-expanded`, keyboard activation, visible chevron affordance
- Provide a single **Collapse all / Expand all** control that affects every visible section

**Non-Goals:**

- Persisting collapse state across sessions or to the backend
- Group-level progress bar visuals (text stats only in the header)
- New API endpoints or domain use cases
- Changing global album progress (`ProgressBar` at top)

## Decisions

### 1. Lift collapse state to `StickerListPage`

Manage collapse in the page with `collapsedGroups: Set<string>` (or equivalent). Pass `isExpanded` and `onToggle` to each `StickerListSection`. Individual header clicks add/remove the group from the set; default is empty set (all expanded).

**Rationale:** Collapse-all requires coordinating every section. Lifting state to the page is the minimal pattern that supports both per-section toggles and bulk collapse/expand.

**Alternative:** Local `useState` per section — rejected because collapse-all cannot reach sibling sections without refs or context.

### 2. Collapse-all control placement and behavior

Add a text button (or icon+label) in a toolbar row between `FilterChips` and the sticker list sections. Label toggles based on state:

- When any section is expanded → show **Collapse all**; clicking collapses every group that currently has visible stickers
- When all visible sections are collapsed → show **Expand all**; clicking expands all

Only groups with at least one visible sticker participate in bulk actions. Hidden/empty groups are ignored.

**Rationale:** Keeps the control near the list it affects without cluttering the global header or filter chips.

### 3. Pure helper for group progress

Add `computeGroupProgress(stickers, getCount)` (co-located with the component or in a small `groupProgress.ts` util):

- `total` = number of stickers in the section (visible after filters)
- `owned` = stickers where `getCount(id) > 0`
- `percentage` = `total > 0 ? Math.round((owned / total) * 100) : 0`, clamped 0–100

**Rationale:** Keeps JSX thin, easy to unit test in isolation.

### 4. Stats reflect visible stickers only

When the Missing filter or search narrows the list, group totals use only stickers currently in that section's `stickers` prop.

**Rationale:** Header stats match what the user sees below; avoids confusion when a group shows 3 missing of 3 visible vs 3 of 48 total.

### 5. Header layout

Flex row: `[chevron] [icon] [title] … [stats]` with stats right-aligned (`margin-left: auto`). Stats use secondary text color (`--text-muted` / Fog Label). Chevron rotates when collapsed.

**Rationale:** Matches the highlighted area in the mockup; consistent with existing heading flex layout.

### 6. Conditional list rendering

When collapsed, do not render the `.list` container (conditional render preferred over `display: none`).

**Rationale:** Reduces scroll length for collapsed groups.

### 7. Heading semantics

The toggle is a `<button type="button">` wrapping icon, title, stats, and chevron. Set `aria-expanded` on the button. Keep group name in accessible name.

**Rationale:** Screen readers announce expand/collapse; tests use `getByRole('button')` with group name.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Stats differ from full-group totals when filtered | Document in spec; stats scoped to visible stickers |
| Collapse state resets on filter change | Reset `collapsedGroups` when filtered sticker set changes, or recompute visible group keys — prefer clearing on filter/search change for predictability |
| Long group names squeeze stats on narrow viewports | Stats use `flex-shrink: 0`; title truncates with ellipsis if needed |
| Collapse-all label ambiguity when mixed state | Use "Collapse all" when ≥1 section expanded; "Expand all" only when all visible sections collapsed |

## Migration Plan

1. Add failing tests for progress text, per-section collapse, and collapse-all
2. Implement `computeGroupProgress` helper
3. Lift collapse state to `StickerListPage`; wire section props
4. Update `StickerListSection` markup, stats, and CSS
5. Add collapse-all toolbar control and page tests
6. Run frontend tests and lint

## Open Questions

- None
