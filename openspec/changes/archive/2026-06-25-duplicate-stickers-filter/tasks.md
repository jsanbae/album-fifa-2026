## 1. Frontend — duplicates filter (TDD)

- [x] 1.1 Add failing unit test for `filterStickersByOwnership` duplicates behavior (`count >= 2`)
- [x] 1.2 Extend `CatalogFilter` type with `'duplicates'` and update `useCatalog` to skip group API param for duplicates (same as missing/collected)
- [x] 1.3 Implement duplicates branch in `filterStickersByOwnership`

## 2. Filter chips UI

- [x] 2.1 Add failing test: FilterChips renders Duplicates chip after Collected and before group chips
- [x] 2.2 Add Duplicates to `BASE_FILTERS` in `FilterChips` with label "Duplicates"
- [x] 2.3 Add or update `StickerListPage` test: Duplicates filter shows only stickers with count `>= 2`

## 3. Validation

- [x] 3.1 Run `npm run test`, `npm run build`, and `npm run lint` for frontend
