## Why

The album progress card at the top of the list shows how many stickers are collected (`owned / total`) but not the completion percentage. Section headers already display `owned / total (percentage%)`, so the overall progress stat feels inconsistent and forces users to mentally estimate how close they are to finishing the album.

## What Changes

- Extend the overall progress stats line to include the collected percentage beside the count, using the same format as section headers: `owned / total (percentage%)` (e.g. `142 / 990 (14%)`)
- Use the percentage already provided by collection progress data (rounded integer, clamped 0–100)
- Show `— / total (—%)` while collection progress is unavailable (unauthenticated or loading)
- Update accessibility so the stats line and progress bar remain correctly associated
- Add component tests for the new stats format

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Extend the progress display requirement so overall album progress includes the collected percentage alongside the owned/total count

## Impact

- **Frontend**: `ProgressBar.tsx`, `ProgressBar.module.css` (if layout tweaks needed), `ProgressBar.test.tsx`
- **No backend or API changes** (percentage already returned by `fetchProgress`)
- **No changes** to section header progress, filters, or collection domain logic
