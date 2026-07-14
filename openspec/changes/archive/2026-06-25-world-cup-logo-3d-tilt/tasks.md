## 1. Asset

- [x] 1.1 Copy the FIFA World Cup 2026 logo PNG to `frontend/public/world-cup-2026-logo.png`

## 2. Tests (TDD)

- [x] 2.1 Add failing test: collection dashboard header shows the tournament logo with accessible name
- [x] 2.2 Add failing test: `useTilt3D` maps pointer position to rotateX/rotateY values (clamped)
- [x] 2.3 Add failing test: `useTilt3D` resets tilt on pointer leave
- [x] 2.4 Add failing test: reduced motion disables tilt listeners and keeps transform neutral
- [x] 2.5 Add failing test: pointer move over logo applies a non-neutral transform when motion is allowed

## 3. Tilt hook

- [x] 3.1 Implement `useTilt3D` hook with pointer tracking, clamped angles, and `prefers-reduced-motion` handling

## 4. Logo component

- [x] 4.1 Create `WorldCupLogoTilt` component with perspective container and logo image
- [x] 4.2 Style tilt surface, transitions, and logo sizing in `WorldCupLogoTilt.module.css`

## 5. Dashboard integration

- [x] 5.1 Add `WorldCupLogoTilt` to `StickerListPage` header layout
- [x] 5.2 Update `StickerListPage.module.css` for header flex alignment with logo + title

## 6. Validation

- [x] 6.1 Run frontend unit tests (`npm run test` in `frontend`)
- [x] 6.2 Run lint and build for frontend
