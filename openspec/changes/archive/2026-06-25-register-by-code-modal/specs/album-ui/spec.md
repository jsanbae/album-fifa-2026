## MODIFIED Requirements

### Requirement: Register by code form

The collection dashboard SHALL provide a modal for authenticated users to register multiple stickers by entering comma-separated sticker codes. The main dashboard SHALL NOT show the registration text input until the user opens the modal.

#### Scenario: Register action visible when authenticated

- **WHEN** an authenticated user views the sticker list
- **THEN** a **Register stickers** control is visible below the progress bar and the registration text input is not visible on the main screen

#### Scenario: Register action hidden when unauthenticated

- **WHEN** a user is not authenticated
- **THEN** the register stickers control and modal are not available (same gate as count controls)

#### Scenario: Open registration modal

- **WHEN** an authenticated user activates **Register stickers**
- **THEN** a modal opens with the register-by-code form, including a dialog title and close control

#### Scenario: Close registration modal

- **WHEN** a user activates the modal close control or presses Escape
- **THEN** the modal closes and the main dashboard shows only the search input among text fields

#### Scenario: Submit registers codes

- **WHEN** a user enters `MEX1, FWC1` in the modal and submits the form
- **THEN** the API register endpoint is called and displayed counts for those stickers increase by 1 each

#### Scenario: Progress updates after register

- **WHEN** a user registers a sticker that was missing (count `0`)
- **THEN** the album progress owned count increases accordingly

#### Scenario: Unknown codes feedback

- **WHEN** a user submits codes including an unrecognized code
- **THEN** the UI shows which codes were not recognized inside the modal while still reflecting updates for valid codes

#### Scenario: Modal closes on full success

- **WHEN** registration completes successfully with at least one valid code and no unknown codes
- **THEN** the input field is cleared and the modal closes

#### Scenario: Submit disabled while loading

- **WHEN** a registration request is in progress
- **THEN** the submit control is disabled until the request completes

#### Scenario: Modal accessibility

- **WHEN** the registration modal is open
- **THEN** the dialog exposes an accessible name via its title and supports keyboard dismissal with Escape

## ADDED Requirements

### Requirement: Shared modal component

The UI SHALL provide a reusable modal component in the shared module for focused overlay interactions.

#### Scenario: Modal uses dialog semantics

- **WHEN** a modal is rendered in the open state
- **THEN** it is implemented with `role="dialog"` (via native `<dialog>`) and an accessible title

#### Scenario: Modal backdrop

- **WHEN** a modal is open
- **THEN** a visual backdrop separates the modal content from the page behind it
