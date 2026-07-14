## MODIFIED Requirements

### Requirement: Filter chips

The UI SHALL provide filter chips for All, Missing, Collected, Duplicates, and each catalog group/section.

#### Scenario: Missing filter

- **WHEN** a user selects the Missing filter
- **THEN** only stickers with count `0` are shown

#### Scenario: Collected filter

- **WHEN** a user selects the Collected filter
- **THEN** only stickers with count `>= 1` are shown

#### Scenario: Collected filter with search

- **WHEN** a user selects the Collected filter and enters a search query
- **THEN** only collected stickers matching the search are shown

#### Scenario: Duplicates filter

- **WHEN** a user selects the Duplicates filter
- **THEN** only stickers with count `>= 2` are shown

#### Scenario: Duplicates filter with search

- **WHEN** a user selects the Duplicates filter and enters a search query
- **THEN** only duplicate stickers matching the search are shown

#### Scenario: Group filter

- **WHEN** a user selects filter `Grupo A`
- **THEN** only stickers in `Grupo A` are shown

#### Scenario: FIFA World Cup filter chip icon

- **WHEN** the filter chips are rendered
- **THEN** the `FIFA World Cup` chip displays the FIFA SVG icon alongside its label

#### Scenario: Coca-Cola filter chip icon

- **WHEN** the filter chips are rendered
- **THEN** the `Coca-Cola` chip displays the Coca-Cola SVG icon alongside its label
