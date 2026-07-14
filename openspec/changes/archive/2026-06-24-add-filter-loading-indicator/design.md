## Context

`useCatalog` sets `loading: true` on every `setFilter` and `setSearch` call via `loadStickersInternal`. After the initial catalog load, users see outdated stickers during refetches with no feedback that new results are on the way.

The design system (`DESIGN.md`) bans circular spinners — use inline text. The search field is the primary control users interact with when filtering results (search + filter chips both trigger refetches).

## Goals / Non-Goals

**Goals:**

- Show an inline text loading indicator inside the search input during catalog refetches (when stickers are already loaded)
- Keep the sticker list visible; avoid replacing it during refetch
- Preserve accessibility with `aria-busy` on the input and `role="status"` for the loading text
- Cover the refetch loading path with unit tests

**Non-Goals:**

- Circular spinners or skeleton rows
- Disabling filter chips or search during load
- Backend or `useCatalog` changes
- Initial page-load loading (still handled by the list-area message)

## Decisions

### 1. In-input loading indicator on refetch

Add a `loading` prop to `StickerSearch`. When true, render "Loading…" text positioned inside the input on the right and set `aria-busy` on the input.

**Rationale:** Keeps context at the control area; list stays visible so layout does not jump.

**Alternative:** Replace list content while loading — rejected per updated direction to use the input field.

### 2. Show during any refetch after initial load

`StickerListPage` passes `loading={catalogHook.loading && catalogHook.stickers.isSome()}`.

**Rationale:** Covers both filter-chip and search refetches with one condition; initial load still uses the list-area message only.

### 3. Neutral loading copy

Use "Loading…" (not "Searching…") because filter-chip changes also trigger the indicator.

### 4. No hook changes

`useCatalog` already exposes `loading`. Only `StickerSearch` and `StickerListPage` wiring change.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Stale list visible during load | Acceptable; loading text in input signals in-progress fetch |
| "Loading…" in search field during filter-only change | Neutral copy; input is the designated loading affordance |
| Text overlaps long search queries | Extra right padding on input when loading |

## Migration Plan

1. Add failing `StickerSearch` test for in-input loading
2. Implement `StickerSearch` loading UI and CSS
3. Wire `loading` prop from `StickerListPage`
4. Run frontend tests and lint

## Open Questions

- None
