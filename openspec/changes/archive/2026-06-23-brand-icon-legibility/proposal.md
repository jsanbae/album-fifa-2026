## Why

The Coca-Cola script logo in sticker list rows is barely legible at mobile size. Brand SVGs use a wide aspect ratio (`viewBox` ~200×48) but are sized with the same **fixed width** as country flags (~1.5rem). That forces the logo into a very short height (~0.36rem), while flags occupy a taller ~1rem slot. Users cannot read the Coca-Cola wordmark in the list.

## What Changes

- Tighten SVG `viewBox` on `CocaColaIcon` (and `FifaIcon` for consistency) to remove excess horizontal/vertical padding while preserving aspect ratio
- Change `GroupIcon` row sizing from **width-based** to **height-based**, aligned with the `CountryFlag` slot height
- Add a max-width guard so wide logos do not overflow the row on narrow viewports
- Update component tests and visual regression expectations for icon dimensions

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Brand group icons (`FIFA World Cup`, `Coca-Cola`) SHALL be legible in sticker rows at mobile size, using height-aligned sizing and trimmed SVG viewBoxes

## Impact

- **Frontend**: `CocaColaIcon.tsx`, `FifaIcon.tsx`, `GroupIcon.module.css`, possibly `CountryFlag.module.css` shared slot token
- **Tests**: `CocaColaIcon.test.tsx`, `FifaIcon.test.tsx`, sticker list row tests
- **Backend**: No changes
