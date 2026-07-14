## Why

Collectors can filter missing and collected stickers, but cannot quickly find stickers they own more than once. A **Duplicates** filter completes the ownership filter set and helps users spot swap candidates or review bulk registrations without scanning the full album.

## What Changes

- Add a **Duplicates** filter chip alongside All, Missing, and Collected
- When active, show only stickers where the user's count is `>= 2` (domain definition of a duplicate)
- Apply client-side using the same collection counts as other ownership filters (no new API)
- Combine with search: search narrows the catalog fetch; Duplicates narrows by ownership client-side
- Update filter chip order: All, Missing, Collected, Duplicates, then section groups

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Add Duplicates ownership filter chip and list behavior mirroring Collected/Missing filter semantics

## Impact

- **Frontend**: `CatalogFilter` type, `filterStickersByOwnership`, `FilterChips`, `useCatalog.hook` (treat `duplicates` like `missing`/`collected` for API params), component and page tests
- **No backend or API changes**
