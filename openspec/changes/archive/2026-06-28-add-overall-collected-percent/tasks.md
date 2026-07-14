## 1. ProgressBar — overall percentage display (TDD)

- [x] 1.1 Add failing test: loaded progress shows `owned / total (percentage%)` (e.g. `142 / 990 (14%)`)
- [x] 1.2 Add failing test: unavailable progress shows `— / 990 (—%)`
- [x] 1.3 Update existing accessibility test to expect the new stats format

## 2. ProgressBar — implementation

- [x] 2.1 Update `resolveProgressValues` in `ProgressBar.tsx` to append `(percentage%)` to `statsText` for loaded and unavailable states
- [x] 2.2 Adjust `ProgressBar.module.css` only if the longer stats line needs layout tweaks on 375px

## 3. Validation

- [x] 3.1 Run frontend tests for `ProgressBar` and full project validation
