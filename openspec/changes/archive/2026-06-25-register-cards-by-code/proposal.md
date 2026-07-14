## Why

Users often receive multiple stickers at once (from packs or trades) and know the sticker codes printed on the back. Tapping increment on each row one-by-one is slow on mobile. A bulk register-by-code flow lets users paste or type several codes at once and update their collection in a single action.

## What Changes

- Add a **Register by code** UI: text input accepting comma-separated sticker codes and a submit action
- Add a backend **bulk register** operation that increments each valid sticker code by 1 (creates count `1` when missing, increments when already owned)
- Parse and normalize input (trim whitespace, ignore empty segments, case-insensitive code matching)
- Return a structured result: updated stickers with new counts, plus any unrecognized codes
- Refresh collection progress and visible sticker counts after successful registration
- Require authentication (same gate as per-row count controls)

## Capabilities

### New Capabilities

<!-- None — extends existing collection and album-ui capabilities -->

### Modified Capabilities

- `collection`: Bulk register stickers by code via a new authenticated API endpoint; each code increments count by 1 using existing increment semantics
- `album-ui`: Register-by-code form on the collection dashboard with validation feedback and post-submit count refresh

## Impact

- **Backend**: New `RegisterStickersByCodeUseCase`, DTO, `CollectionController` route, factory wiring, unit and e2e tests
- **Frontend**: New `RegisterByCode` component, `CollectionApiAdapter` method, `useCollection` hook action, integration on `StickerListPage`
- **Common**: New `API_ROUTES.collection.registerByCode` route constant
- **API**: `POST /api/collection/register` with body `{ codes: string }` (comma-separated raw input) or `{ stickerIds: string[] }` — design will finalize shape
