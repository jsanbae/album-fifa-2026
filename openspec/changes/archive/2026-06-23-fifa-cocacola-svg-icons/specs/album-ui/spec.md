## MODIFIED Requirements

### Requirement: Sticker list rows

Each sticker row SHALL display the sticker id, sticker name, count controls, and country information when applicable.

#### Scenario: Team sticker row

- **WHEN** a sticker has `countryId` `MEX`
- **THEN** the row displays the country flag (SVG), Spanish country name, sticker id, sticker name, and count controls

#### Scenario: FIFA World Cup sticker row

- **WHEN** a sticker belongs to group `FIFA World Cup` and has no `countryId`
- **THEN** the row displays the FIFA SVG icon, group name, sticker id, sticker name, and count controls

#### Scenario: Coca-Cola sticker row

- **WHEN** a sticker belongs to group `Coca-Cola` and has no `countryId`
- **THEN** the row displays the Coca-Cola SVG icon, group name, sticker id, sticker name, and count controls

#### Scenario: Other special section sticker row

- **WHEN** a sticker has no `countryId` and group is not `FIFA World Cup` or `Coca-Cola` (e.g. `00` intro)
- **THEN** the row displays sticker id and name without a country flag, group icon, or country name

### Requirement: Section headers

The list SHALL group stickers under section headers matching the `group` field, in order: FIFA World Cup, Grupo A–L, Coca-Cola.

#### Scenario: Section header visible

- **WHEN** the user scrolls through the list
- **THEN** section headers appear before the first sticker of each group

#### Scenario: FIFA World Cup section header icon

- **WHEN** a section header is rendered for group `FIFA World Cup`
- **THEN** the FIFA SVG icon is displayed alongside the section title

#### Scenario: Coca-Cola section header icon

- **WHEN** a section header is rendered for group `Coca-Cola`
- **THEN** the Coca-Cola SVG icon is displayed alongside the section title

### Requirement: Filter chips

The UI SHALL provide filter chips for All, Missing, and each catalog group/section.

#### Scenario: Missing filter

- **WHEN** a user selects the Missing filter
- **THEN** only stickers with count `0` are shown

#### Scenario: Group filter

- **WHEN** a user selects filter `Grupo A`
- **THEN** only stickers in `Grupo A` are shown

#### Scenario: FIFA World Cup filter chip icon

- **WHEN** the filter chips are rendered
- **THEN** the `FIFA World Cup` chip displays the FIFA SVG icon alongside its label

#### Scenario: Coca-Cola filter chip icon

- **WHEN** the filter chips are rendered
- **THEN** the `Coca-Cola` chip displays the Coca-Cola SVG icon alongside its label

## ADDED Requirements

### Requirement: Branded group SVG icons

The UI SHALL provide inline SVG React components for the FIFA wordmark and Coca-Cola script logo, used wherever `FIFA World Cup` or `Coca-Cola` groups are displayed with an icon.

#### Scenario: FIFA icon accessibility

- **WHEN** the FIFA SVG icon is rendered
- **THEN** it has `role="img"` and an accessible label of `FIFA World Cup`

#### Scenario: Coca-Cola icon accessibility

- **WHEN** the Coca-Cola SVG icon is rendered
- **THEN** it has `role="img"` and an accessible label of `Coca-Cola`

#### Scenario: Icon brand colors

- **WHEN** the FIFA SVG icon is rendered
- **THEN** the logo fill color is FIFA blue (`#326295`)

#### Scenario: Coca-Cola brand color

- **WHEN** the Coca-Cola SVG icon is rendered
- **THEN** the logo fill color is Coca-Cola red (`#F40009`)
