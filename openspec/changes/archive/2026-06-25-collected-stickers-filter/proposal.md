## Why

Collectors can already filter to stickers they are missing, but there is no quick way to review only the stickers they already own. A **Collected** filter complements **Missing** and helps users browse duplicates, verify recent registrations, or scan what they have in a specific group.

## What Changes

- Add a **Collected** filter chip alongside All and Missing
- When active, show only stickers where the user's count is `>= 1`
- Apply client-side using the same collection counts as the Missing filter (no new API)
- Combine with search and group filters: group/search narrow the catalog fetch; Collected narrows by ownership client-side
- Update filter chip order: All, Missing, Collected, then section groups

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Add Collected ownership filter chip and list behavior mirroring Missing filter semantics

## Impact

- **Frontend**: `CatalogFilter` type, `FilterChips`, `StickerListPage.filterStickers`, `useCatalog.hook` (treat `collected` like `missing` for API params), component tests
- **No backend or API changes**
