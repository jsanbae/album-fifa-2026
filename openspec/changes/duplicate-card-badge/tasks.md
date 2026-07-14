## 1. StickerListRow — duplicate badge (TDD)

- [x] 1.1 Add failing test: duplicate badge is visible when count is `>= 2`
- [x] 1.2 Add failing test: duplicate badge is hidden when count is `0` or `1`
- [x] 1.3 Add failing test: duplicate badge exposes accessible duplicate text

## 2. StickerListRow — implementation

- [x] 2.1 Add `nameRow` wrapper and conditional **Duplicate** badge next to country/group name in `StickerListRow.tsx`
- [x] 2.2 Add `.nameRow` and `.duplicateBadge` styles in `StickerListRow.module.css` (compact pill, does not crowd count controls)

## 3. Validation

- [x] 3.1 Run frontend tests for `StickerListRow` and full frontend validation (`npm run test`, `npm run build`, `npm run lint`)
