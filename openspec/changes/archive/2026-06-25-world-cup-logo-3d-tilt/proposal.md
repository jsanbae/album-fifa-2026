## Why

The collection dashboard header currently shows only plain text ("Album FIFA 2026") with no visual tie to the FIFA World Cup 2026 tournament. Adding the official tournament logo with a subtle interactive 3D tilt gives the app a recognizable branded anchor at the top of the screen while staying aligned with the premium, modern feel of the design system.

## What Changes

- Add the FIFA World Cup 2026 official logo image to the collection dashboard header
- Implement a pointer-driven 3D tilt effect on the logo (mouse and touch) using CSS transforms
- Reset tilt smoothly when the pointer leaves the logo area
- Honor `prefers-reduced-motion`: show the static logo with no tilt animation or pointer tracking
- Add accessible labeling (`alt` / `aria-hidden` as appropriate) and frontend tests for presence and reduced-motion behavior

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Dashboard header SHALL display the FIFA World Cup 2026 logo with an interactive 3D tilt effect and accessible reduced-motion fallback

## Impact

- **Frontend**: New `WorldCupLogoTilt` component, `useTilt3D` hook, CSS Module, static image asset; updates to `StickerListPage` header layout and tests
- **Backend**: No changes
- **API**: No changes
- **Dependencies**: No new npm packages (vanilla React + CSS transforms)
