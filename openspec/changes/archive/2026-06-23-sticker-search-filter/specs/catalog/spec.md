## MODIFIED Requirements

### Requirement: List stickers use case

The catalog SHALL provide a use case to list all stickers, optionally filtered by group and searchable by sticker id prefix or name substring.

#### Scenario: Filter by group

- **WHEN** listing stickers with group filter `Grupo A`
- **THEN** only stickers with `group` equal to `Grupo A` are returned

#### Scenario: Search by id prefix

- **WHEN** listing stickers with search `MEX`
- **THEN** stickers whose id starts with `MEX` are returned

#### Scenario: Search by id prefix case-insensitive

- **WHEN** listing stickers with search `mex`
- **THEN** stickers whose id starts with `MEX` are returned

#### Scenario: Search by name substring

- **WHEN** listing stickers with search `Yamal`
- **THEN** stickers whose name contains `Yamal` are returned

#### Scenario: Search by name case-insensitive

- **WHEN** listing stickers with search `yamal`
- **THEN** stickers whose name contains `Yamal` are returned

#### Scenario: Empty search returns all

- **WHEN** listing stickers with search empty or whitespace only
- **THEN** no search filter is applied
