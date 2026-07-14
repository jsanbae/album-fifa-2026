## Context

The sticker list supports ownership filter chips: **All**, **Missing** (`count === 0`), **Collected** (`count >= 1`), and each catalog group (server-side `group` query param). Search is server-side via `search` param. Ownership filtering lives in `filterStickersByOwnership` using `collectionHook.getCount`.

The collection domain defines a duplicate as count `>= 2` (one owned copy plus extras). There is no filter for that subset yet — it was explicitly deferred when Collected was added.

## Goals / Non-Goals

**Goals:**

- Add **Duplicates** chip with label "Duplicates"
- Filter stickers where `getCount(stickerId) >= 2`
- Mirror Collected/Missing filter architecture (client-side ownership filter, no API change)
- Work combined with search (server fetch + client ownership filter)
- TDD: failing tests first

**Non-Goals:**

- Showing duplicate *quantity* (e.g. sort by count or badge "×3") — defer
- Separate API endpoint for duplicate stickers
- Changing Missing or Collected filter behavior

## Decisions

### 1. Client-side ownership filter

Extend `filterStickersByOwnership`:

```typescript
if (filter === 'duplicates') {
  return stickers.filter((sticker) => getCount(sticker.id) >= 2);
}
```

**Rationale:** Same pattern as Missing/Collected; collection counts already loaded for authenticated users. Aligns with domain definition of duplicate (count `>= 2`).

### 2. `CatalogFilter` type

```typescript
export type CatalogFilter = 'all' | 'missing' | 'collected' | 'duplicates' | string;
```

`duplicates` is a reserved token alongside `missing` and `collected`; group names remain strings.

### 3. API fetch behavior

In `useCatalog.loadStickersInternal`, treat `duplicates` like `missing` and `collected` — do not send `group` query param when filter is `duplicates` (fetch full catalog for client-side filter).

**Combined filters:** Chips remain mutually exclusive. Duplicates OR Collected OR Missing OR group OR All.

### 4. Filter chip order and label

`BASE_FILTERS`: `['all', 'missing', 'collected', 'duplicates']` then `GROUP_DISPLAY_ORDER`.

Label: **Duplicates** (parallel to **Collected** / **Missing**).

### 5. Unauthenticated users

When not signed in, all counts are `0`; Duplicates shows empty list with existing "No stickers match your filters." message. No special auth gate on the chip (consistent with other ownership filters).

### 6. Section progress when Duplicates active

Section headers compute progress from visible stickers in the section prop — when Duplicates filter is active, passed stickers are pre-filtered, so group progress reflects duplicates-only subset. No extra work.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Extra chip adds horizontal scroll on mobile | Chips already wrap; "Duplicates" is a short label |
| Empty Duplicates list when not signed in | Acceptable; same empty-state message as Collected |
| Overlap with Collected (duplicates ⊆ collected) | Intentional; users choose the narrower view when needed |

## Migration Plan

1. Extend types and `filterStickersByOwnership` (TDD)
2. Update `FilterChips` and `useCatalog` API param logic
3. Add component/page tests
4. Run frontend validation

No data migration.

## Open Questions

- None
