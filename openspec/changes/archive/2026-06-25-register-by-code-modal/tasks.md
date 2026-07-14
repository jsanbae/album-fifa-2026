## 1. Shared Modal component (TDD)

- [x] 1.1 Add failing tests for `Modal` (dialog role, title, open/close, Escape dismissal)
- [x] 1.2 Implement `Modal` component with CSS Module using native `<dialog>`

## 2. Register-by-code modal (TDD)

- [x] 2.1 Add failing tests for `RegisterByCodeModal` (form inside dialog, closes on full success, stays open on unknown codes)
- [x] 2.2 Implement `RegisterByCodeModal` composing `Modal` and `RegisterByCodeForm`
- [x] 2.3 Adjust `RegisterByCodeForm` if needed to support `onSuccess` callback for modal close

## 3. Dashboard integration

- [x] 3.1 Replace inline `RegisterByCodeForm` on `StickerListPage` with **Register stickers** trigger + modal
- [x] 3.2 Update `StickerListPage.test.tsx` and `RegisterByCodeForm.test.tsx` for modal flow

## 4. Validation

- [x] 4.1 Run `npm run test`, `npm run build`, and `npm run lint` for frontend
