## 1. Backend — catalog search (TDD)

- [x] 1.1 Add failing tests for case-insensitive id prefix search in `ListStickersUseCase.test.ts`
- [x] 1.2 Add failing tests for name substring search (case-sensitive and case-insensitive)
- [x] 1.3 Replace `idPrefix` with `search` in `ListStickersInput` and implement `matchesStickerSearch` filter
- [x] 1.4 Update `CatalogController` to read `search` query param (remove `idPrefix`)
- [x] 1.5 Update e2e tests for `?search=` parameter

## 2. Frontend — search UI

- [x] 2.1 Update `CatalogApiAdapter` to send `search` instead of `idPrefix`
- [x] 2.2 Update `useCatalog.hook` to use `search` param
- [x] 2.3 Update `StickerSearch` label, placeholder, and remove numeric inputMode
- [x] 2.4 Add or update component test for search input accessibility label

## 3. Validation

- [x] 3.1 Run `npm run test`, `npm run build`, and `npm run lint` across all packages
