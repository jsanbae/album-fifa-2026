## 1. Tests (TDD)

- [x] 1.1 Add failing tests for `WorldCupEmblem` compact and hero static variants
- [x] 1.2 Add failing tests for interactive tilt and reduced motion on `WorldCupEmblem`
- [x] 1.3 Move hook tests from `WorldCupLogoTilt.test.tsx` to `WorldCupEmblem.test.tsx`
- [x] 1.4 Update `SignInBranding` tests: hierarchy only; emblem via composition

## 2. Shared primitives

- [x] 2.1 Create `usePrefersReducedMotion` hook in shared
- [x] 2.2 Create `WorldCupEmblem` component and CSS (variants + optional interactive tilt)

## 3. Consumer refactor

- [x] 3.1 Refactor `SignInBranding` to compose `<WorldCupEmblem variant="hero" interactive />`
- [x] 3.2 Update `StickerListPage` to import `WorldCupEmblem` from shared
- [x] 3.3 Remove emblem-specific CSS from `SignInBranding.module.css`

## 4. Catalog cleanup

- [x] 4.1 Delete `WorldCupLogoTilt` component and CSS from catalog
- [x] 4.2 Delete `WorldCupLogoTilt.test.tsx` after migration

## 5. Validation

- [x] 5.1 Run frontend unit tests (`npm run test` in `frontend`)
- [x] 5.2 Run lint and build for frontend
