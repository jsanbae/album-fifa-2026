## ADDED Requirements

### Requirement: Register by code form

The collection dashboard SHALL provide a form for authenticated users to register multiple stickers by entering comma-separated sticker codes.

#### Scenario: Form visible when authenticated

- **WHEN** an authenticated user views the sticker list
- **THEN** a register-by-code input and submit control are visible below the progress bar

#### Scenario: Form hidden when unauthenticated

- **WHEN** a user is not authenticated
- **THEN** the register-by-code form is not shown (or is disabled with the same gate as count controls)

#### Scenario: Submit registers codes

- **WHEN** a user enters `MEX1, FWC1` and submits the form
- **THEN** the API register endpoint is called and displayed counts for those stickers increase by 1 each

#### Scenario: Progress updates after register

- **WHEN** a user registers a sticker that was missing (count `0`)
- **THEN** the album progress owned count increases accordingly

#### Scenario: Unknown codes feedback

- **WHEN** a user submits codes including an unrecognized code
- **THEN** the UI shows which codes were not recognized while still reflecting updates for valid codes

#### Scenario: Input cleared on success

- **WHEN** registration completes successfully with at least one valid code
- **THEN** the input field is cleared

#### Scenario: Submit disabled while loading

- **WHEN** a registration request is in progress
- **THEN** the submit control is disabled until the request completes
