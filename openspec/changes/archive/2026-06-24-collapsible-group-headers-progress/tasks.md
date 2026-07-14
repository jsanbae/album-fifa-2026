## 1. Tests (TDD)

- [x] 1.1 Add failing test: `computeGroupProgress` returns owned, total, and percentage for a sticker set
- [x] 1.2 Add failing test: section header shows progress text (e.g. `2 / 3 (67%)`)
- [x] 1.3 Add failing test: section defaults expanded with `aria-expanded="true"`
- [x] 1.4 Add failing test: clicking header collapses rows and sets `aria-expanded="false"`
- [x] 1.5 Add failing test: clicking collapsed header expands rows again
- [x] 1.6 Update existing icon tests to work with collapsible header button
- [x] 1.7 Add failing test: **Collapse all** hides all visible section rows
- [x] 1.8 Add failing test: **Expand all** restores all visible section rows after collapse-all

## 2. Group progress helper

- [x] 2.1 Implement `computeGroupProgress(stickers, getCount)` with owned = count > 0, percentage clamped 0–100

## 3. Collapsible section header UI

- [x] 3.1 Lift collapse state to `StickerListPage` (`collapsedGroups` set); pass `isExpanded` / `onToggle` to sections
- [x] 3.2 Convert `StickerListSection` heading to a toggle button with chevron affordance
- [x] 3.3 Render progress stats on the right side of the header
- [x] 3.4 Conditionally render sticker list when expanded; wire `aria-expanded`
- [x] 3.5 Style header layout, chevron, and stats in `StickerListSection.module.css`

## 4. Collapse-all control

- [x] 4.1 Add collapse-all / expand-all button between filter chips and section list
- [x] 4.2 Wire bulk collapse and expand to page-level `collapsedGroups` state
- [x] 4.3 Style toolbar row in `StickerListPage.module.css`

## 5. Validation

- [x] 5.1 Run frontend unit tests (`npm run test` in `frontend`)
- [x] 5.2 Run lint and build for frontend
