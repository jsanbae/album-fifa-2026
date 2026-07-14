## 1. Tests (TDD)

- [x] 1.1 Add failing test: `CocaColaIcon` renders with height-aligned class and minimum legible dimensions
- [x] 1.2 Add failing test: `GroupIcon` `md` size uses height-based CSS (not width-only)

## 2. SVG viewBox trim

- [x] 2.1 Tighten `CocaColaIcon` viewBox to remove excess margins while preserving aspect ratio
- [x] 2.2 Tighten `FifaIcon` viewBox for consistency

## 3. CSS sizing

- [x] 3.1 Update `GroupIcon.module.css`: height-based `md` and `sm` variants with `max-width` guard
- [x] 3.2 Align flag slot height with `CountryFlag` via shared CSS variable or matching `1rem` height

## 4. Validation

- [x] 4.1 Update icon component tests to pass with new sizing
- [x] 4.2 Run `npm run test`, `npm run build`, `npm run lint` in frontend
- [x] 4.3 Visual check: Coca-Cola rows (CC1–CC14) legible at mobile width
