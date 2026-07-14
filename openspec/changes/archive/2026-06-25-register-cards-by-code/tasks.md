## 1. Backend — register by code (TDD)

- [x] 1.1 Add failing unit tests for `RegisterStickersByCodeUseCase` (new stickers, existing stickers, duplicates, case-insensitive, whitespace, unknown codes, empty input)
- [x] 1.2 Implement `RegisterStickersByCodeUseCase` with catalog lookup and increment semantics
- [x] 1.3 Add `RegisterStickersByCodeDTO` and wire use case in collection factory
- [x] 1.4 Add `POST /api/collection/register` route in `CollectionController` and `api-routes.ts`
- [x] 1.5 Add e2e tests for register endpoint (success, unknown codes, unauthenticated, empty input)

## 2. Frontend — adapter and hook

- [x] 2.1 Add failing tests for `CollectionApiAdapter.registerByCode`
- [x] 2.2 Implement `registerByCode` in `CollectionApiAdapter` and `API_ROUTES`
- [x] 2.3 Add failing tests for `useCollection.registerByCode` (count merge, error handling)
- [x] 2.4 Implement `registerByCode` in `useCollection` hook with optimistic count/progress updates

## 3. Frontend — UI component

- [x] 3.1 Add failing component tests for `RegisterByCodeForm` (submit, loading, unknown codes feedback, auth gate)
- [x] 3.2 Implement `RegisterByCodeForm` component with CSS Module
- [x] 3.3 Integrate form into `StickerListPage` below progress bar (authenticated only)
- [x] 3.4 Sync returned counts into `useCatalog` sticker list state after registration

## 4. Validation

- [x] 4.1 Run `npm run test`, `npm run build`, and `npm run lint` across all packages
