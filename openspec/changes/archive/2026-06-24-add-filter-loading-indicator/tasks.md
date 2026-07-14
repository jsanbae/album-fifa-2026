## 1. Tests (TDD)

- [x] 1.1 Add failing test: `StickerSearch` shows in-input loading with `aria-busy` and status text
- [x] 1.2 Add failing test: `StickerListPage` passes loading to search during refetch

## 2. Search input loading UI

- [x] 2.1 Add `loading` prop to `StickerSearch` with inline "Loading…" indicator inside the field
- [x] 2.2 Style input wrapper, right-aligned loading text, and extra padding when loading
- [x] 2.3 Wire `loading={catalogHook.loading && catalogHook.stickers.isSome()}` from `StickerListPage`

## 3. Validation

- [x] 3.1 Run frontend unit tests (`npm run test` in `frontend`)
- [x] 3.2 Run lint and build for frontend
