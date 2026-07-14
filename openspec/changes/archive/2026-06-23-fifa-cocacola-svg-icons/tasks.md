## 1. SVG icon components (TDD)

- [x] 1.1 Add failing tests for `FifaIcon` (renders SVG, `role="img"`, aria-label `FIFA World Cup`, fill `#326295`)
- [x] 1.2 Add failing tests for `CocaColaIcon` (renders SVG, `role="img"`, aria-label `Coca-Cola`, fill `#F40009`)
- [x] 1.3 Implement `FifaIcon.tsx` with inline SVG paths traced from reference image
- [x] 1.4 Implement `CocaColaIcon.tsx` with inline SVG paths traced from reference image
- [x] 1.5 Add `GroupIcon.tsx` resolver mapping group name to icon component (or null)
- [x] 1.6 Add `GroupIcon.module.css` with `sm` and `md` size variants aligned to `CountryFlag` dimensions

## 2. Sticker list integration

- [x] 2.1 Add failing test: FIFA World Cup sticker row shows FIFA icon in flag slot
- [x] 2.2 Add failing test: Coca-Cola sticker row shows Coca-Cola icon in flag slot
- [x] 2.3 Update `StickerListRow` to render `GroupIcon` when sticker has no `isoCode` and group is FIFA World Cup or Coca-Cola
- [x] 2.4 Add failing test: FIFA World Cup section header shows FIFA icon
- [x] 2.5 Add failing test: Coca-Cola section header shows Coca-Cola icon
- [x] 2.6 Update `StickerListSection` heading to prepend `GroupIcon` for branded groups
- [x] 2.7 Update `StickerListSection.module.css` for icon + title layout

## 3. Filter chips integration

- [x] 3.1 Add failing test: FIFA World Cup and Coca-Cola filter chips render their icons
- [x] 3.2 Update `FilterChips` to prepend `GroupIcon` (size `sm`) for FIFA World Cup and Coca-Cola chips
- [x] 3.3 Update `FilterChips.module.css` for icon alignment inside chips

## 4. Validation

- [x] 4.1 Run `npm run test`, `npm run build`, and `npm run lint` across all packages
- [x] 4.2 Visual check on 375px viewport: row, section header, and chip layouts have no overflow
