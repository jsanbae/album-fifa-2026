## Why

When users change a filter chip or search query, the catalog hook refetches stickers but the sticker list keeps showing stale results until the API responds. There is no visual feedback that a new result set is loading, which makes the app feel unresponsive and can mislead users into thinking their filter did nothing.

## What Changes

- Show an inline "Loading…" indicator inside the search input while catalog data is being refetched (after the initial load)
- Reuse the design-system text loading pattern (no circular spinners)
- Keep the sticker list visible during refetch; loading feedback lives in the search field
- Add frontend tests for in-input loading on refetch

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Loading indicator SHALL appear inside the search input while filter or search results are being refetched

## Impact

- **Frontend**: `StickerSearch.tsx`, `StickerSearch.module.css`, `StickerListPage.tsx`, `StickerSearch.test.tsx`, `StickerListPage.test.tsx`
- **Backend**: No changes
- **API**: No changes (`useCatalog` already exposes `loading` during `setFilter` / `setSearch`)
