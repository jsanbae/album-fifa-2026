## 1. Frontend — collected filter (TDD)

- [x] 1.1 Add failing unit test for `filterStickers` collected behavior (or extract and test filter helper)
- [x] 1.2 Extend `CatalogFilter` type with `'collected'` and update `useCatalog` to skip group API param for collected (same as missing)
- [x] 1.3 Implement collected branch in `StickerListPage.filterStickers`

## 2. Filter chips UI

- [x] 2.1 Add failing test: FilterChips renders Collected chip between Missing and group chips
- [x] 2.2 Add Collected to `BASE_FILTERS` in `FilterChips` with label "Collected"
- [x] 2.3 Add or update `StickerListPage` test: Collected filter shows only owned stickers

## 3. Validation

- [x] 3.1 Run `npm run test`, `npm run build`, and `npm run lint` for frontend
