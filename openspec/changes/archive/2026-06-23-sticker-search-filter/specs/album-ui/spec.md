## MODIFIED Requirements

### Requirement: Search by sticker id or name

The UI SHALL provide a search input to filter stickers by id prefix or name substring, case-insensitively.

#### Scenario: Search by id

- **WHEN** a user types `MEX` in the search field
- **THEN** only stickers whose id starts with `MEX` are shown

#### Scenario: Search by id case-insensitive

- **WHEN** a user types `mex` in the search field
- **THEN** only stickers whose id starts with `MEX` are shown

#### Scenario: Search by name

- **WHEN** a user types `Yamal` in the search field
- **THEN** stickers whose name contains `Yamal` are shown

#### Scenario: Search by name case-insensitive

- **WHEN** a user types `yamal` in the search field
- **THEN** stickers whose name contains `Yamal` are shown
