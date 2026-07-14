## Why

Users search for stickers by player or team name (e.g. "Yamal", "Messi") and often type ids in mixed case. The current search only matches sticker id prefixes and is case-sensitive, making it hard to find stickers quickly on mobile.

## What Changes

- Extend catalog search to match sticker **id prefix** or **name substring**, case-insensitively
- Replace `idPrefix` query parameter with `search` on `GET /api/catalog/stickers` (**BREAKING** for API clients using `idPrefix`)
- Update `ListStickersUseCase` filter logic and unit tests
- Update frontend search input label/placeholder and wire to `search` parameter
- Apply client-side missing filter case-insensitively when combined with search (missing filter unchanged; search normalization in catalog layer)

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `catalog`: Sticker list search matches id prefix or name substring, case-insensitive
- `album-ui`: Search input filters by sticker id or name, case-insensitive

## Impact

- **Backend**: `ListStickersUseCase`, `CatalogDTO`, `CatalogController`, e2e tests
- **Frontend**: `CatalogApiAdapter`, `useCatalog.hook`, `StickerSearch` component
- **API**: `GET /api/catalog/stickers?search=` replaces `idPrefix` query param
