## Why

The collection dashboard now shows both a search input and a register-by-code input on the same screen. Two text fields with different purposes compete for attention and make the mobile layout feel crowded. Moving registration into a modal keeps the main view focused on browsing and searching stickers.

## What Changes

- Replace the inline register-by-code form with a **Register stickers** action that opens a modal
- Move the existing `RegisterByCodeForm` into the modal dialog
- Add a shared accessible `Modal` component (native `<dialog>`) for reuse
- Keep registration behavior unchanged (comma-separated codes, API call, feedback, auth gate)
- Close the modal automatically after a fully successful registration; keep it open when unknown codes need review

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Register-by-code UI opens in a modal triggered from the dashboard instead of an always-visible inline form

## Impact

- **Frontend**: New `Modal` component, new `RegisterByCodeModal` (or wrapper), update `StickerListPage`, CSS Modules, component tests
- **No backend or API changes**
