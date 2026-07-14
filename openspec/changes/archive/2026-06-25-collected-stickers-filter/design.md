## Context

The sticker list supports filter chips: **All**, **Missing** (client-side `count === 0`), and each catalog group (server-side `group` query param). Search is server-side via `search` param. Missing filter logic lives in `StickerListPage.filterStickers` using `collectionHook.getCount`.

There is no symmetric filter for owned stickers (`count >= 1`).

## Goals / Non-Goals

**Goals:**

- Add **Collected** chip with label "Collected"
- Filter stickers where `getCount(stickerId) >= 1`
- Mirror Missing filter architecture (client-side ownership filter, no API change)
- Work combined with search and group filters
- TDD: failing tests first

**Non-Goals:**

- Filtering by duplicate count (`count > 1`) — defer
- Separate API endpoint for owned stickers
- Changing Missing filter behavior

## Decisions

### 1. Client-side ownership filter

Extend `filterStickers` in `StickerListPage`:

```typescript
if (filter === 'collected') {
  return stickers.filter((sticker) => getCount(sticker.id) >= 1);
}
```

**Rationale:** Same pattern as Missing; collection counts already loaded for authenticated users.

### 2. `CatalogFilter` type

```typescript
export type CatalogFilter = 'all' | 'missing' | 'collected' | string;
```

`collected` and `missing` are reserved tokens; group names remain strings.

### 3. API fetch behavior

In `useCatalog.loadStickersInternal`, treat `collected` like `missing` — do not send `group` query param when filter is `collected` (fetch full catalog for client-side filter). When filter is a group name, keep existing server-side group filter.

**Combined filters:** User selects `Grupo A` then cannot also select Collected as separate chip — chips are mutually exclusive. Collected OR Grupo A OR Missing OR All. No change to mutual exclusivity.

### 4. Filter chip order and label

`BASE_FILTERS`: `['all', 'missing', 'collected']` then `GROUP_DISPLAY_ORDER`.

Label: **Collected** (parallel to **Missing**).

### 5. Unauthenticated users

When not signed in, all counts are `0`; Collected shows empty list with existing "No stickers match your filters." message. No special auth gate on the chip (consistent with Missing — unauthenticated users see all as missing).

### 6. Section progress when Collected active

Section headers already compute progress from visible stickers in the section prop — when Collected filter is active, passed stickers are pre-filtered, so group progress reflects collected-only subset. No extra work.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Extra chip adds horizontal scroll on mobile | Chips already wrap; Collected is short label |
| Empty Collected list when not signed in | Acceptable; same empty-state message |

## Migration Plan

1. Extend types and `filterStickers` (TDD)
2. Update `FilterChips` and `useCatalog` API param logic
3. Add component/page tests
4. Run frontend validation

No data migration.

## Open Questions

- None
