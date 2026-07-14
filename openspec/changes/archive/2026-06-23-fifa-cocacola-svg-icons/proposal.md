## Why

FIFA World Cup and Coca-Cola stickers are special album sections without country flags. Section headers, filter chips, and sticker rows currently show plain text for these groups, which looks inconsistent next to country flags on team stickers and makes the two branded sections harder to scan visually.

## What Changes

- Add inline SVG React icon components for the FIFA wordmark and Coca-Cola script logo
- Show the FIFA icon for `FIFA World Cup` group stickers, section headers, and filter chips
- Show the Coca-Cola icon for `Coca-Cola` group stickers, section headers, and filter chips
- Reuse a shared icon sizing and accessibility pattern consistent with `CountryFlag`
- Add component tests for icon rendering and integration in list UI

## Capabilities

### New Capabilities

<!-- None — icons extend existing album UI behavior -->

### Modified Capabilities

- `album-ui`: Special-section stickers, section headers, and filter chips SHALL display FIFA and Coca-Cola SVG icons where the group is `FIFA World Cup` or `Coca-Cola`

## Impact

- **Frontend**: New SVG icon components under `frontend/src/catalog/infrastructure/ui/components/`, updates to `StickerListRow`, `StickerListSection`, `FilterChips`, and associated CSS Modules
- **Tests**: Component tests for icons and updated sticker list / filter chip tests
- **Backend / API**: No changes
