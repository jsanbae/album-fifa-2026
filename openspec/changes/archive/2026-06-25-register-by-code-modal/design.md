## Context

`RegisterByCodeForm` is rendered inline on `StickerListPage` between the progress bar and the search input. Search and registration are both text inputs with different mental models (filter vs. mutate), which creates visual clutter on a 375px mobile viewport.

Registration logic (`useCollection.registerByCode`, API adapter, backend) stays as-is. Only the presentation layer changes.

## Goals / Non-Goals

**Goals:**

- Single search input visible on the main dashboard at rest
- Authenticated users open registration via a clear **Register stickers** control
- Modal contains the existing form, feedback, and loading states
- Accessible dialog: focus management, `Escape` to close, labelled title
- TDD: update/add component tests first

**Non-Goals:**

- Changing registration API or hook semantics
- Bottom sheet / drawer pattern (use centered modal for MVP)
- Registering from other pages
- Third-party modal library

## Decisions

### 1. Shared `Modal` component

Add `shared/infrastructure/ui/components/Modal/Modal.tsx` using the native HTML `<dialog>` element.

**Behavior:**

- `open` boolean prop controls `showModal()` / `close()`
- Renders backdrop via `::backdrop` in CSS Module
- `onClose` callback when user dismisses (Escape, close button, backdrop click)
- `aria-labelledby` pointing to modal title
- Focus moves to first focusable element when opened (browser default for dialog)

**Rationale:** No new dependency; `<dialog>` provides baseline accessibility. Reusable for future flows.

### 2. `RegisterByCodeModal` wrapper

New component in `collection/infrastructure/ui/components/` that composes:

- `Modal` shell with title "Register stickers"
- Existing `RegisterByCodeForm` as body content
- Close button in header

Props: `open`, `onClose`, `onRegister`, `loading` (same contract as current inline usage).

**On successful submit** (at least one valid code and `unknownCodes` empty): call `onClose` after clearing input (delegate to form, then parent closes).

**On partial success** (unknown codes): keep modal open so user can read feedback and fix input.

### 3. Dashboard trigger placement

On `StickerListPage`, replace inline `<RegisterByCodeForm>` with a single button below the progress bar:

- Label: **Register stickers**
- Visible only when authenticated
- Opens modal; does not navigate away

Search input remains directly below the trigger (or below progress when unauthenticated).

**Alternative:** FAB floating action — rejected; button in toolbar area matches existing section toolbar patterns.

### 4. Test updates

- Update `RegisterByCodeForm.test.tsx` — unchanged form behavior
- Add `Modal.test.tsx` — open/close, labelled dialog
- Add/update `RegisterByCodeModal.test.tsx` — opens from trigger, closes on success
- Update `StickerListPage.test.tsx` — expects trigger not inline input; modal opens on click

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Extra tap to register | Acceptable trade-off for cleaner main screen; primary browse flow unaffected |
| Modal harder to discover | Clear button label "Register stickers" near progress |
| `<dialog>` browser support | Supported in all target browsers; test in Vitest with jsdom (polyfill showModal if needed) |

## Migration Plan

1. Implement `Modal` + tests
2. Implement `RegisterByCodeModal` + tests
3. Wire into `StickerListPage`, remove inline form
4. Run full frontend test/lint/build

No data or API migration.

## Open Questions

- None
