## Why

The Duplicates filter helps users find extra copies, but in the default list view there is no at-a-glance signal that a sticker is duplicated. A compact badge beside the country or group name makes swap candidates and bulk-registered stickers easy to spot without changing filters.

## What Changes

- Add a **Duplicate** badge inline next to the country/group name in each sticker list row when the user's count is `>= 2` (same domain definition as the Duplicates filter)
- Hide the badge when count is `0` or `1`
- Style the badge as a small pill consistent with the dark album UI (subtle accent, does not compete with count controls)
- Expose accessible text so screen readers announce duplicate status alongside the row label
- Add component tests for show/hide behavior

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Extend sticker list row requirements to show a duplicate badge next to country/group name when count indicates a duplicate

## Impact

- **Frontend**: `StickerListRow.tsx`, `StickerListRow.module.css`, `StickerListRow.test.tsx`
- **No backend or API changes**
- **No changes** to filter chips, count controls, or collection domain logic
