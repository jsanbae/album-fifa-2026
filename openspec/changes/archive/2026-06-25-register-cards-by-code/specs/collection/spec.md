## ADDED Requirements

### Requirement: Register stickers by code

The collection SHALL provide a bulk operation that accepts a comma-separated list of sticker codes and increments each valid code by 1, using the same semantics as the single-sticker increment operation.

#### Scenario: Register new stickers

- **WHEN** a user registers codes `MEX1, MEX2` and neither sticker has a collection entry
- **THEN** `MEX1` count becomes `1` and `MEX2` count becomes `1`

#### Scenario: Register already-owned stickers

- **WHEN** a user registers code `MEX1` and `MEX1` already has count `2`
- **THEN** `MEX1` count becomes `3`

#### Scenario: Duplicate codes in input

- **WHEN** a user registers codes `MEX1, MEX1`
- **THEN** `MEX1` count increases by `2` relative to the starting count

#### Scenario: Case-insensitive code matching

- **WHEN** a user registers code `mex1` and the catalog id is `MEX1`
- **THEN** the collection entry for `MEX1` is incremented

#### Scenario: Whitespace normalization

- **WHEN** a user registers codes ` MEX1 , MEX2 `
- **THEN** both `MEX1` and `MEX2` are incremented and empty segments are ignored

#### Scenario: Unknown codes reported

- **WHEN** a user registers codes `MEX1, NOTREAL`
- **THEN** `MEX1` is incremented and `NOTREAL` is returned in `unknownCodes` without failing the whole operation

#### Scenario: Empty input rejected

- **WHEN** a user submits an empty or whitespace-only codes string
- **THEN** the operation fails with a validation error

### Requirement: Register by code HTTP API

The backend SHALL expose an authenticated endpoint for bulk registration by code.

#### Scenario: Register via API

- **WHEN** an authenticated user calls `POST /api/collection/register` with body `{ "codes": "MEX1, MEX2" }`
- **THEN** the response includes `updated` entries with each sticker id and new count, and `unknownCodes` for any invalid codes

#### Scenario: Unauthenticated register rejected

- **WHEN** an unauthenticated user calls `POST /api/collection/register`
- **THEN** the API returns 401 Unauthorized
