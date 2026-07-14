## Why

The sticker list groups stickers under section headers (FIFA World Cup, Grupo A–L, Coca-Cola), but headers are static and give no sense of completion within each group. Users scrolling a long album cannot quickly see how far they have progressed per section or collapse groups they are not working on, which slows navigation and makes the list harder to scan.

## What Changes

- Make each group section header clickable to expand or collapse its sticker rows
- Display per-group progress in the header as `owned / total (percentage%)`, e.g. `8 / 10 (80%)`
- Compute group stats from visible stickers in the section and the user's current collection counts (count > 0 = owned)
- Default sections to expanded; persist collapse state only for the current session (no backend change)
- Add chevron or equivalent affordance indicating expanded/collapsed state
- Add a **Collapse all / Expand all** control above the sticker list to collapse or expand every visible section at once
- Add frontend tests for collapse toggle, progress display, collapse-all, and accessibility

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Section headers SHALL be collapsible, SHALL display per-group collection progress (`owned / total (percentage%)`), and the list SHALL provide a collapse-all / expand-all control

## Impact

- **Frontend**: `StickerListSection.tsx`, `StickerListSection.module.css`, `StickerListSection.test.tsx`, `StickerListPage.tsx`, `StickerListPage.module.css`, `StickerListPage.test.tsx` (if present); a small pure helper for group progress calculation
- **Backend**: No changes
- **API**: No changes (uses existing `getCount` from collection hook)
