## ADDED Requirements

### Requirement: Sticker count per user

The collection SHALL track a non-negative integer `count` per sticker per authenticated user.

#### Scenario: Missing sticker

- **WHEN** a user has no entry for a sticker
- **THEN** the effective count is `0` (missing)

#### Scenario: Owned sticker

- **WHEN** a user sets count to `1`
- **THEN** the sticker is considered owned for album progress

#### Scenario: Duplicate sticker

- **WHEN** a user sets count to `2` or higher
- **THEN** the sticker is owned and has duplicates (count minus 1)

### Requirement: Increment count

The collection SHALL provide an operation to increment a sticker count by 1.

#### Scenario: Increment from zero

- **WHEN** a user increments a sticker with count `0`
- **THEN** the count becomes `1`

#### Scenario: Increment existing

- **WHEN** a user increments a sticker with count `2`
- **THEN** the count becomes `3`

### Requirement: Decrement count

The collection SHALL provide an operation to decrement a sticker count by 1, with a floor of `0`.

#### Scenario: Decrement to zero

- **WHEN** a user decrements a sticker with count `1`
- **THEN** the count becomes `0`

#### Scenario: Decrement at zero

- **WHEN** a user decrements a sticker with count `0`
- **THEN** the count remains `0`

### Requirement: Set count

The collection SHALL allow setting count to any non-negative integer.

#### Scenario: Set count directly

- **WHEN** a user sets count to `5` for sticker `BRA10`
- **THEN** the stored count is `5`

#### Scenario: Reject negative count

- **WHEN** a user attempts to set count to a negative value
- **THEN** the operation fails with a domain error

### Requirement: Album progress

Progress SHALL be calculated as the number of stickers with `count >= 1` divided by total catalog stickers (990).

#### Scenario: Progress calculation

- **WHEN** a user owns 100 stickers (count >= 1) out of 990
- **THEN** progress reports `owned: 100`, `total: 990`, and `percentage` approximately 10.1

#### Scenario: Duplicates do not increase owned count

- **WHEN** a user has count `3` on one sticker and count `0` on others
- **THEN** that sticker contributes `1` to the owned count, not `3`

### Requirement: User identity

Collection entries SHALL be scoped to the authenticated user id from Supabase Auth JWT.

#### Scenario: User isolation

- **WHEN** user A sets count on a sticker
- **THEN** user B does not see that count in their collection

### Requirement: Collection HTTP API

The backend SHALL expose authenticated endpoints for collection operations.

#### Scenario: Get collection

- **WHEN** an authenticated user calls `GET /api/collection`
- **THEN** the response includes all sticker ids with their counts for that user

#### Scenario: Get progress

- **WHEN** an authenticated user calls `GET /api/collection/progress`
- **THEN** the response includes owned, total, and percentage

#### Scenario: Increment via API

- **WHEN** an authenticated user calls `POST /api/collection/stickers/MEX3/increment`
- **THEN** the count for `MEX3` increases by 1

#### Scenario: Unauthenticated request rejected

- **WHEN** an unauthenticated user calls a collection endpoint
- **THEN** the API returns 401 Unauthorized

### Requirement: Merge collection into sticker list

When listing stickers for an authenticated user, the API SHALL include each sticker's current `count`.

#### Scenario: Sticker list includes count

- **WHEN** an authenticated user requests the sticker list
- **THEN** each sticker includes `count` from the user's collection (default `0`)

### Requirement: InMemory repository for tests

The collection domain SHALL define a `CollectionRepository` port with an InMemory implementation for unit tests.

#### Scenario: InMemory collection in tests

- **WHEN** unit tests run collection use cases
- **THEN** they use InMemoryCollectionRepository without external dependencies

### Requirement: Supabase persistence

The collection SHALL persist entries to Supabase Postgres via a repository adapter.

#### Scenario: Count survives reload

- **WHEN** a user sets a count and the server restarts
- **THEN** the count is still retrievable from Supabase
